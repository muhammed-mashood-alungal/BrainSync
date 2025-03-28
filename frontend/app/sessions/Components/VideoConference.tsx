'use client'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Peer from 'simple-peer'
import styles from '../../styles/Room.module.css'
import { useVideoCall } from '@/Context/videoConference.context'

interface VideoFProps {
    peer: Peer.Instance
    userId: string,
    email : string
}

const VideoF: React.FC<VideoFProps> = ({ peer, userId , email }) => {

    const videoRef = useRef<HTMLVideoElement>(null)
    const [connected, setConnected] = useState(false)
    const [hasStream, setHasStream] = useState(false)

    useEffect(() => {
        peer.on('stream', (stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setHasStream(true)
            }
        })
        peer.on('connect', () => setConnected(true))

        return () => {
            peer.off('stream', () => { })
            peer.off('connect', () => { })
        }
    }, [peer])

    return (
        <div className={`${styles.videoContainer}  h-80`}>
            <video ref={videoRef} autoPlay playsInline className={` scale-x-[-1] `} />
            <div className={styles.videoLabel}>
                {email}
                {!connected && ' (Connecting...)'}
                {connected && !hasStream && ' (No Stream)'}
            </div>
        </div>
    )
}

export default function Room({  isVideoEnabled, isAudioEnabled  }: {
    isVideoEnabled: boolean,
    isAudioEnabled: boolean
}) {

    const router = useRouter()
    const { peers, myStream, isMuted, isVideoOff, toggleMute, toggleVideo } = useVideoCall();
    const myVideoRef = useRef<HTMLVideoElement>(null)

    
    useEffect(() => {
        if (myVideoRef.current && myStream) {
            myVideoRef.current.srcObject = myStream;
        }
    }, [myStream]);

    useEffect(() => {
        toggleMute(isAudioEnabled)
    }, [isAudioEnabled])


    useEffect(() => {
        toggleVideo(isVideoEnabled)
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
          style={getGridStyles(peers.length+1)}
        >
          <div 
            className="rounded-md flex items-center  w-full justify-center scale-x-[-1]"
            style={{ aspectRatio: "16/9" }}
          >
            <video
              ref={myVideoRef}
              autoPlay
              muted
              className="w-full h-80 object-cover rounded-md"
            />
          </div>
    
          {peers.map((peerData: PeerData) => (
            <div 
              key={peerData.peerId}
              className="rounded-md flex items-center justify-center"
              style={{ aspectRatio: "16/9" }}
            >
              <VideoF peer={peerData.peer} userId={peerData.peerId} email={peerData?.email as string} />
            </div>
          ))}
        </div>
      );
}

interface PeerData {
    peer: any; // Replace with actual peer type from your video/streaming library
    peerId: string;
    email? :string
  }

