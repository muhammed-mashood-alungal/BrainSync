import {
  createContext,
  ReactNode,
  use,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import { useAuth } from "./auth.context";
import { useSocket } from "./socket.context";
import { noteServices } from "@/services/client/note.client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { UserServices } from "@/services/client/user.client";
import { SessionServices } from "@/services/client/session.client";

interface PeerData {
  peerId: string;
  peer: Peer.Instance;
  stream?: MediaStream;
  email: string;
}

interface VideoCallState {
  peers: PeerData[];
  myStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: (state: boolean) => void;
  toggleVideo: (state: boolean) => void;
  speakingUsers: Set<string>;
  leaveRoom: (
    duration: number,
    log: { joinTime: Date; leaveTime: Date; duration: number }
  ) => void;
  audioMutedUsers: Set<string>;
  videoOffUsers: Set<string>;
  amSpeaking: boolean;
}

export const VideoCallContext = createContext<VideoCallState | undefined>(
  undefined
);

export const VideoCallProvider = ({
  roomId,
  children,
}: {
  roomId: string;
  children: ReactNode;
}) => {
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [speakingUsers, setSpeakingUsers] = useState<Set<string>>(new Set());
  const speakingTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const [audioMutedUsers, setAudioMutedUsers] = useState<Set<string>>(
    new Set()
  );
  const [videoOffUsers, setVideoOffUsers] = useState<Set<string>>(new Set());
  const [amSpeaking, setAmSpeaking] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const myStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<PeerData[]>([]);
  const { user } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    if (!myStreamRef.current) return;

    let cleanupFunction: (() => void) | undefined;
    const setupDetection = async () => {
      try {
        cleanupFunction = await detectSpeaking(
          myStreamRef.current!,
          socketRef.current?.id as string
        );
      } catch (error) {
        console.error("Error setting up audio detection:", error);
      }
    };

    setupDetection();

    return () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
    };
  }, [myStreamRef.current]);

  useEffect(() => {
    if (!socket) return;
    socketRef.current = socket;
    socketRef.current?.on("connect", () => {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then((stream) => {
          myStreamRef.current = stream;
          
          socketRef.current?.emit(
            "join-room",
            roomId,
            socketRef.current?.id,
            user?.email
          );

          socketRef.current?.on(
            "all-users",
            (users: { userId: string; email: string }[]) => {
              const newPeers = users
                .filter((usr) => {
                  if (user?.email == usr.email) {
                    toast.error("You Are Already On this session")
                    return router.push('/dashboard/sessions')
                  } else {
                    return !peersRef.current.some((p) => p.email === usr.email);
                  }
                })
                .map((usr) => {
                  const peer = createPeer(
                    usr.userId,
                    socketRef.current!.id as string,
                    stream
                  );
                  return { peerId: usr.userId, peer, email: usr.email };
                });
              console.log(newPeers, [...peersRef.current, ...newPeers]);
              peersRef.current = [...peersRef.current, ...newPeers];
              setPeers(peersRef.current);
            }
          );

          socketRef.current?.on("user-joined", (userId: string, email) => {
            for(let p of peersRef.current){
              if(p.peerId == userId  || p.email == email){
                return
              }
            }
            if(user?.email == email) return
            const peer = addPeer(
              userId,
              socketRef.current!.id as string,
              stream
            );
            const newPeer = { peerId: userId, peer, email };
            peersRef.current = [...peersRef.current, newPeer];

            setPeers((prev) => {
              if (prev.some((p) => p.peerId === userId)) {
                return prev;
              } else {
                return [...prev, newPeer];
              }
            });
          });

          socketRef.current?.on("user-speaking", (peerId: string) => {
            if (speakingTimeoutsRef.current.has(peerId)) {
              clearTimeout(speakingTimeoutsRef.current.get(peerId));
              speakingTimeoutsRef.current.delete(peerId);
            }
            setAmSpeaking(true);
            setSpeakingUsers((prev) => new Set(prev).add(peerId));
          });

          socketRef.current?.on("user-stopped-speaking", (peerId: string) => {
            const timeout = setTimeout(() => {
              setSpeakingUsers((prev) => {
                const updated = new Set([...prev]);
                updated.delete(peerId);
                return updated;
              });
              speakingTimeoutsRef.current.delete(peerId);
            }, 2500);
            setAmSpeaking(false);
            speakingTimeoutsRef.current.set(peerId, timeout);
          });

          socketRef.current?.on(
            "user-toggled-audio",
            (userId: string, isMuted: boolean) => {
              setAudioMutedUsers((prev) => {
                const users = new Set(prev);
                if (isMuted) {
                  users.add(userId);
                } else {
                  users.delete(userId);
                }
                return users;
              });
            }
          );

          socketRef.current?.on("user-toggled-video", (peerId, videoOff) => {
            setVideoOffUsers((prev) => {
              const newSet = new Set(prev);
              if (videoOff) {
                newSet.add(peerId);
              } else {
                newSet.delete(peerId);
              }
              return newSet;
            });
          });

          socketRef.current?.on(
            "signal",
            (data: { from: string; signal: Peer.SignalData }) => {
              const item = peersRef.current.find((p) => p.peerId === data.from);
              if (item && item.peer) {
                try {
                  item.peer.signal(data.signal);
                } catch (err) {
                  console.error(`Error signaling peer ${data.from}:`, err);
                }
              } else {
                console.warn(
                  `Peer not found or undefined for user ${data.from}`
                );
              }
            }
          );

          socketRef.current?.on("session-stopped", (data) => {
            toast.error(data.reason || "Session Ended By admin");
            socketRef.current?.disconnect();
            router.push("/dashboard/sessions");
          });

          socketRef.current?.on("user-disconnected", (userId: string) => {
            const newPeers = peersRef.current.filter(
              (p) => p.peerId !== userId
            );
            peersRef.current = newPeers;
            setPeers(newPeers);
          });
        })
        .catch((err) => {
          console.error("Failed to get media devices:", err);
        });
    });

    return () => {
      myStreamRef.current?.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach(({ peer }) => peer.destroy());
      socketRef.current?.off("user-toggled-video");
      socketRef.current?.disconnect();
    };
  }, [roomId, socket]);

  const createPeer = (
    userToSignal: string,
    callerId: string,
    stream: MediaStream
  ) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (signal) => {
      socketRef.current?.emit("signal", {
        to: userToSignal,
        from: callerId,
        signal,
      });
    });
    peer.on("error", (err) =>
      console.error(`Peer error with ${userToSignal}:`, err)
    );
    return peer;
  };

  const addPeer = (
    incomingUserId: string,
    callerId: string,
    stream: MediaStream
  ) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (signal) => {
      socketRef.current?.emit("signal", {
        to: incomingUserId,
        from: callerId,
        signal,
      });
    });
    peer.on("error", (err) =>
      console.error(`Peer error with ${incomingUserId}:`, err)
    );
    return peer;
  };

  const toggleMute = (state: boolean) => {
    myStreamRef.current
      ?.getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    socketRef.current?.emit("toggle-mute", {
      isMuted: state,
      roomId,
      peerId: socketRef.current?.id as string,
    });
    if (state) {
      setIsMuted(state);
    } else {
      setTimeout(() => {
        setIsMuted(state);
      }, 1000);
    }
  };

  const toggleVideo = (state: boolean) => {
    socketRef.current?.emit("toggle-video", {
      videoOff: state,
      roomId,
      peerId: socketRef.current?.id as string,
    });
    setIsVideoOff(state);
  };

  const detectSpeaking = async (stream: MediaStream, peerId: string) => {
    const audioContext = new AudioContext();

    if (audioContext.audioWorklet === undefined) {
      console.warn(
        "AudioWorklet not supported in this browser. Falling back to analyzer-only approach"
      );
      return fallbackDetectSpeaking(stream, peerId);
    }

    try {
      await audioContext.audioWorklet.addModule("/audio-processor.js");

      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);

      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;

      // Create an instance of the processor
      const audioProcessor = new AudioWorkletNode(
        audioContext,
        "audio-level-processor"
      );

      // Handle messages from the processor
      audioProcessor.port.onmessage = (event) => {
        const { average } = event.data;

        // Consider someone is speaking if the average is above a threshold
        if (average > 5) {
          socketRef.current?.emit("user-speaking", { peerId, roomId });
        } else {
          socketRef.current?.emit("user-stopped-speaking", { peerId, roomId });
        }
      };

      // Connect the nodes
      microphone.connect(analyser);
      analyser.connect(audioProcessor);
      audioProcessor.connect(audioContext.destination);

      return () => {
        audioProcessor.disconnect();
        analyser.disconnect();
        microphone.disconnect();
        audioContext.close();
      };
    } catch (error) {
      console.error("Error setting up AudioWorklet:", error);
      return fallbackDetectSpeaking(stream, peerId);
    }
  };

  // Fallback method using analyzer node with requestAnimationFrame
  const fallbackDetectSpeaking = (stream: MediaStream, peerId: string) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    // Don't connect the analyser to destination to avoid audio feedback

    let animationFrameId: number;
    const checkAudioLevel = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      const arraySum = array.reduce((a, value) => a + value, 0);
      const average = arraySum / array.length;

      if (average > 20) {
        socketRef.current?.emit("user-speaking", { peerId, roomId });
      } else {
        socketRef.current?.emit("user-stopped-speaking", { peerId, roomId });
      }

      animationFrameId = requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();

    return () => {
      cancelAnimationFrame(animationFrameId);
      analyser.disconnect();
      microphone.disconnect();
      audioContext.close();
    };
  };

  const leaveRoom = async (
    duration: number,
    log: { joinTime: Date; leaveTime: Date; duration: number }
  ) => {
    try {
      if (myStreamRef.current) {
        myStreamRef.current.getTracks().forEach((track) => {
          track.stop();
          myStreamRef.current?.removeTrack(track);
        });
        myStreamRef.current = null;
      }

      if (peersRef.current && peersRef.current.length > 0) {
        peersRef.current.forEach(({ peer }) => {
          peer.destroy();
        });
        peersRef.current = [];
      }

      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      await SessionServices.addSessionTimeSpendByUser(roomId, duration, log);
      const response = await noteServices.saveNote(roomId);
      if (response.success) {
        toast.success("Note Saved in you Resources");
      } else if (response.message) {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error(" Error leaving room:", error);
    }
  };

  const value: VideoCallState = {
    peers,
    myStream: myStreamRef.current,
    isMuted,
    isVideoOff,
    speakingUsers,
    toggleMute,
    toggleVideo,
    leaveRoom,
    videoOffUsers,
    audioMutedUsers,
    amSpeaking,
  };

  return (
    <VideoCallContext.Provider value={value}>
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (!context)
    throw new Error("useVideoCall must be used within a VideoCallProvider");
  return context;
};
