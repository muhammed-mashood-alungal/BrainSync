'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Peer from 'simple-peer'
import styles from '../../styles/Room.module.css'
import { useVideoCall } from '@/Context/videoConference.context'
import { Mic, MicOff, VideoOff, Pin, PinOff } from 'lucide-react'

interface VideoFProps {
  peer: Peer.Instance
  userId: string,
  email: string,
  isPinned: boolean,
  onPinClick: () => void,
}

const VideoF: React.FC<VideoFProps> = ({ peer, userId, email, isPinned, onPinClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [connected, setConnected] = useState(false)
  const [hasStream, setHasStream] = useState(false)
  const { videoOffUsers, audioMutedUsers } = useVideoCall()

  useEffect(() => {
    peer.on('stream', (stream) => {
      handleStream(stream)
    })

    peer.on('connect', () => setConnected(true))

    return () => {
      peer.off('stream', () => { })
      peer.off('connect', () => { })
    }
  }, [peer])

  const handleStream = (stream: any) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream as MediaStream
      const videoStreams = stream.getVideoTracks()
      const hasVideoOn = videoStreams.length > 0 && videoStreams.some((track: any) => track.enabled && track.readyState == 'live')
      setHasStream(hasVideoOn)
    }
  }

  return (
    <div className={`${styles.videoContainer} relative h-full w-full`}>
      <div className='absolute bg-gray-800 opacity-80 rounded-xl px-3 py-1 right-2 bottom-2 z-20'>
        <span>{email}</span>
      </div>
      
      <div 
        className="absolute top-2 right-2 z-20 cursor-pointer bg-gray-800 bg-opacity-60 p-2 rounded-full"
        onClick={onPinClick}
      >
        {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
      </div>
      
      {videoOffUsers.has(userId) && (
        <div className="flex items-center justify-center w-full h-full object-cover rounded-md scale-x-[1] bg-gray-800">
          <VideoOff size={64} />
        </div>
      )}
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" hidden={videoOffUsers.has(userId)} />

      <div className={styles.videoLabel}>
        {connected && audioMutedUsers.has(userId) ? <MicOff /> : (connected && !audioMutedUsers.has(userId)) && <Mic/>}
        {!connected && ' (Connecting...)'}
        {connected && !hasStream && ' (No Stream)'}
      </div>
    </div>
  )
}

interface PeerData {
  peer: any;
  peerId: string;
  email?: string;
}

// Define types for our participant objects
type MeParticipant = {
  type: 'me';
  id: string;
};

type PeerParticipant = {
  type: 'peer';
  id: string;
  data: PeerData;
};

type Participant = MeParticipant | PeerParticipant;

export default function Room({ isVideoEnabled, isAudioEnabled }: {
  isVideoEnabled: boolean,
  isAudioEnabled: boolean
}) {
  const { peers, myStream, isMuted, isVideoOff, toggleMute, toggleVideo, speakingUsers, amSpeaking } = useVideoCall();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const [pinnedUser, setPinnedUser] = useState<string | null>(null);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream, isVideoOff]);

  useEffect(() => {
    toggleMute(!isAudioEnabled);
  }, [isAudioEnabled]);

  useEffect(() => {
    toggleVideo(!isVideoEnabled);
  }, [isVideoEnabled]);

  const handlePinUser = (userId: string | null) => {
    setPinnedUser(userId === pinnedUser ? null : userId);
  };

  const getGridLayout = () => {
    const totalParticipants = peers.length + 1;
    const isPinActive = pinnedUser !== null;
    
    if (totalParticipants === 1) {
      return "grid-cols-1";
    }
    
    if (isPinActive) {
      // On mobile, show 2 columns even when a user is pinned
      return "grid-cols-2 md:grid-cols-4";
    }
    
    // Always show at least 2 columns on mobile
    if (totalParticipants <= 2) {
      return "grid-cols-2";
    } else if (totalParticipants <= 4) {
      return "grid-cols-2";
    } else if (totalParticipants <= 9) {
      return "grid-cols-2 md:grid-cols-3";
    } else {
      return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };
  
  // And update the getParticipantClass function to handle mobile pinning:
  const getParticipantClass = (id: string) => {
    if (pinnedUser === null) {
      return ""; // No pinned user, all videos are equal size
    }
    
    if (id === pinnedUser) {
      // For mobile, make pinned user span the full width on its own row
      // For larger screens, use the 3/4 layout
      return "col-span-full md:col-span-3 md:row-span-2 ";
    }
    
    return ""; // Other users are shown in smaller tiles
  };

  // Combined list of all participants (me + peers) with proper typing
  const allParticipants: Participant[] = [
    { type: 'me' as const, id: 'me' },
    ...peers.map(peer => ({ type: 'peer' as const, id: peer.peerId, data: peer }))
  ];
  // Reorder to put pinned user first if any
  const orderedParticipants = allParticipants.sort((a, b) => {
    if (a.id === pinnedUser) return -1;
    if (b.id === pinnedUser) return 1;
    return 0;
  });

  return (
    <div 
    ref={setContainerRef}
    className={`h-[85vh] grid gap-2 p-2 ${getGridLayout()} auto-rows-fr overflow-hidden`}
  >
      {orderedParticipants.map((participant) => {
        if (participant.type === 'me') {
          return (
            <div 
              key="me" 
              className={`${styles.videoContainer} relative h-full w-full rounded-md overflow-hidden ${getParticipantClass('me')}
                transition-colors duration-1500 ease-out
                ${amSpeaking && !isMuted ? 'border-3 border-cyan-600' : 'border-3 border-transparent'}`}
            >
              <div 
                className="absolute top-2 right-2 z-20 cursor-pointer bg-gray-800 bg-opacity-60 p-2 rounded-full"
                onClick={() => handlePinUser('me')}
              >
                {pinnedUser === 'me' ? <PinOff size={16} /> : <Pin size={16} />}
              </div>
              
              {isVideoOff ? (
                <div className="flex items-center justify-center w-full h-full object-cover rounded-md scale-x-[1] bg-gray-800">
                  <VideoOff size={64} />
                </div>
              ) : (
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover rounded-md scale-x-[-1]"
                />
              )}
              
              <div className={styles.videoLabel}>
                {isMuted ? <MicOff/> : <Mic/>}
              </div>
            </div>
          );
        } else {
          // Use type guard to ensure TypeScript knows this participant has data property
          const peerParticipant = participant as PeerParticipant;
          const peerData = peerParticipant.data;
          
          return (
            <div
              key={peerData.peerId}
              className={`rounded-md flex items-center justify-center ${getParticipantClass(peerData.peerId)}
                transition-colors duration-1500 ease-out
                ${speakingUsers.has(peerData.peerId) ? 'border-3 border-cyan-600' : 'border-3 border-transparent'}`}
            >
              <VideoF 
                peer={peerData.peer} 
                userId={peerData.peerId} 
                email={peerData?.email as string}
                isPinned={pinnedUser === peerData.peerId}
                onPinClick={() => handlePinUser(peerData.peerId)} 
              />
            </div>
          );
        }
      })}
    </div>
  );
}