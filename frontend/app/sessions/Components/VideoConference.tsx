'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Peer from 'simple-peer'
import styles from '../../styles/Room.module.css'
import { useVideoCall } from '@/Context/videoConference.context'
import { Mic, MicOff, VideoOff } from 'lucide-react'

interface VideoFProps {
  peer: Peer.Instance
  userId: string,
  email: string
}

const VideoF: React.FC<VideoFProps> = ({ peer, userId }) => {

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
    <div className={`${styles.videoContainer}  h-80 w-full`}>
      {videoOffUsers.has(userId) && (
        <div className="flex items-center justify-center w-full h-80 object-cover rounded-md scale-x-[1] bg-gray-800">
          <VideoOff size={64} />
        </div>
      )}
      <video ref={videoRef} autoPlay playsInline className={` scale-x-[-1] `} hidden={videoOffUsers.has(userId)} />

      <div className={styles.videoLabel}>
        {connected && audioMutedUsers.has(userId) ? <MicOff /> : (connected && !audioMutedUsers.has(userId)) && <Mic/>}
        {!connected && ' (Connecting...)'}
        {connected && !hasStream && ' (No Stream)'}
      </div>
    </div>

  )
}

export default function Room({ isVideoEnabled, isAudioEnabled }: {
  isVideoEnabled: boolean,
  isAudioEnabled: boolean
}) {

  const { peers, myStream, isMuted, isVideoOff, toggleMute, toggleVideo, speakingUsers , amSpeaking } = useVideoCall();
  const myVideoRef = useRef<HTMLVideoElement>(null)


  useEffect(() => {
    if (myVideoRef.current && myStream) {
      myVideoRef.current.srcObject = myStream;
    }
  }, [myStream, isVideoOff])

  useEffect(() => {
    toggleMute(!isAudioEnabled)
  }, [isAudioEnabled])


  useEffect(() => {
    toggleVideo(!isVideoEnabled)
  }, [isVideoEnabled])

  const getGridStyles = (peerCount: number): React.CSSProperties => {
    let minSize: number;
    if (peerCount <= 2) minSize = 400;
    else if (peerCount <= 4) minSize = 350;
    else if (peerCount < 5) minSize = 300;
    else minSize = 150;

    return {
      display: "grid",
      gridTemplateColumns: `repeat(3, minmax(${minSize}px, 1fr))`,
      gridAutoRows: `minmax(${minSize}px, 1fr)`,
      maxHeight: "83vh",
      overflow: "hidden",
      gap: "10px"
    }
  }

  return (
    <div
      className="h-[90vh] grid gap-2 p-2"
      style={getGridStyles(peers.length + 1)}
    >
      
      
      <div className={`${styles.videoContainer}  h-80 w-full 
      transition-colors duration-1500 ease-out
      ${amSpeaking && !isMuted ? 'border-3 border-cyan-600' : 'border-3 border-transparent'} `}>
        {isVideoOff ?
          <div className={`flex items-center justify-center w-full h-80 object-cover rounded-md scale-x-[1] bg-gray-800`}>
            <VideoOff size={64} />
          </div> :
          <>
          
           <video
              ref={myVideoRef}
              autoPlay
              muted
              className="w-full h-80 object-cover rounded-md scale-x-[-1]"
            />
            
            
          </>

        }
        <div className={styles.videoLabel}>
                {isMuted ?  <MicOff/> : <Mic/>}
            </div>
      </div>

      {peers.map((peerData: PeerData) => (
        <div
          key={peerData.peerId}
          className={`
            rounded-md flex items-center justify-center aspect-video
            transition-colors duration-1500 ease-out
            ${speakingUsers.has(peerData.peerId) ? 'border-3 border-cyan-600' : 'border-3 border-transparent'}
          `}
        >
          {/*           
            <VideoF peer={peerData.peer} userId={peerData.peerId} email={peerData?.email as string} /> */}

          <VideoF peer={peerData.peer} userId={peerData.peerId} email={peerData?.email as string} />


        </div>
      ))}
    </div>
  );
}

interface PeerData {
  peer: any;
  peerId: string;
  email?: string
}

