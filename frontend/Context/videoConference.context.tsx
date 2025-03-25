import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'simple-peer';

interface PeerData {
    peerId: string;
    peer: Peer.Instance;
}

interface VideoCallState {
    peers: PeerData[];
    myStream: MediaStream | null;
    isMuted: boolean;
    isVideoOff: boolean;
    toggleMute: (state : boolean) => void;
    toggleVideo: (state : boolean) => void;
    leaveRoom: () => void;
}

export const VideoCallContext = createContext<VideoCallState | undefined>(undefined);

export const VideoCallProvider = ({ roomId, children }: { roomId: string; children: ReactNode }) => {
    const [peers, setPeers] = useState<PeerData[]>([])
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)

    const socketRef = useRef<Socket | null>(null)
    const myStreamRef = useRef<MediaStream | null>(null)
    const peersRef = useRef<PeerData[]>([])

    useEffect(() => {
        socketRef.current = io(process.env.NEXT_PUBLIC_BACKEND_ROOT_URL);

        navigator.mediaDevices
            .getUserMedia({ audio: true, video: true })
            .then((stream) => {
                myStreamRef.current = stream;
                socketRef.current?.emit('join-room', roomId, socketRef.current?.id);

                socketRef.current?.on('all-users', (users: string[]) => {
                    const newPeers = users
                        .filter((userId) => !peersRef.current.some((p) => p.peerId === userId))
                        .map((userId) => {
                            const peer = createPeer(userId, socketRef.current!.id as string, stream);
                            return { peerId: userId, peer };
                        });
                    peersRef.current = [...peersRef.current, ...newPeers];
                    setPeers(peersRef.current);
                });

                socketRef.current?.on('user-joined', (userId: string) => {
                    if (peersRef.current.some((p) => p.peerId === userId)) return;
                    const peer = addPeer(userId, socketRef.current!.id as string, stream);
                    const newPeer = { peerId: userId, peer };
                    peersRef.current = [...peersRef.current, newPeer];
                    setPeers((prev) => (prev.some((p) => p.peerId === userId) ? prev : [...prev, newPeer]));
                });

                socketRef.current?.on('signal', (data: { from: string; signal: Peer.SignalData }) => {
                    const item = peersRef.current.find((p) => p.peerId === data.from);
                    if (item && item.peer) {
                        try {
                            item.peer.signal(data.signal);
                        } catch (err) {
                            console.error(`Error signaling peer ${data.from}:`, err);
                        }
                    } else {
                        console.warn(`Peer not found or undefined for user ${data.from}`);
                    }
                });

                socketRef.current?.on('user-disconnected', (userId: string) => {
                    const newPeers = peersRef.current.filter((p) => p.peerId !== userId);
                    peersRef.current = newPeers;
                    setPeers(newPeers);
                });
            })
            .catch((err) => {
                console.error('Failed to get media devices:', err);
            });

        return () => {
            myStreamRef.current?.getTracks().forEach((track) => track.stop());
            peersRef.current.forEach(({ peer }) => peer.destroy());
            socketRef.current?.disconnect();
        };
    }, [roomId]);

    const createPeer = (userToSignal: string, callerId: string, stream: MediaStream) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on('signal', (signal) => {
            socketRef.current?.emit('signal', { to: userToSignal, from: callerId, signal });
        });
        peer.on('error', (err) => console.error(`Peer error with ${userToSignal}:`, err));
        return peer;
    };

    const addPeer = (incomingUserId: string, callerId: string, stream: MediaStream) => {
        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on('signal', (signal) => {
            socketRef.current?.emit('signal', { to: incomingUserId, from: callerId, signal });
        });
        peer.on('error', (err) => console.error(`Peer error with ${incomingUserId}:`, err));
        return peer;
    };

    const toggleMute = (state : boolean) => {
        myStreamRef.current?.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
        setIsMuted(state);
    };

    const toggleVideo = (state :boolean) => {
        myStreamRef.current?.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
        setIsVideoOff(state);
    };

    const leaveRoom = () => {
        myStreamRef.current?.getTracks().forEach((track) => track.stop());
        peersRef.current.forEach(({ peer }) => peer.destroy());
        socketRef.current?.disconnect();
    };

    const value: VideoCallState = {
        peers,
        myStream: myStreamRef.current,
        isMuted,
        isVideoOff,
        toggleMute,
        toggleVideo,
        leaveRoom,
    };

    return <VideoCallContext.Provider value={value}>{children}</VideoCallContext.Provider>;
};

export const useVideoCall = () => {
    const context = useContext(VideoCallContext);
    if (!context) throw new Error('useVideoCall must be used within a VideoCallProvider');
    return context;
};