'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Peer from 'simple-peer'
import styles from '../../styles/Room.module.css'
import { useVideoCall } from '@/Context/videoConference.context'

interface VideoFProps {
    peer: Peer.Instance
    userId: string
}

const VideoF: React.FC<VideoFProps> = ({ peer, userId }) => {

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
        <div className={styles.videoContainer}>
            <video ref={videoRef} autoPlay playsInline className={`${styles.videoElement} scale-x-[-1]`} />
            <div className={styles.videoLabel}>
                {userId.slice(0, 8)}
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


    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow relative">
                <div className="absolute inset-0 bg-[#1E1E1E] rounded-lg border border-cyan-500">

                    <div className="w-full h-full flex items-center justify-center">
                        <video
                            ref={myVideoRef}
                            autoPlay
                            muted
                            className="w-full h-full object-cover scale-x-[-1]"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 mt-2">
                {/* Participant video tiles */}
                {peers.map(peerData => (
                    <div key={peerData.peerId} className="bg-gray-800 rounded-md h-20 flex items-center justify-center">
                        <VideoF
                            key={peerData.peerId}
                            peer={peerData.peer}
                            userId={peerData.peerId}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}