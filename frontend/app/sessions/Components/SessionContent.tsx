'use client';
import { useEffect, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, LogOut, Send } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import VideoConference from './VideoConference';
import { useVideoCall, VideoCallProvider } from '@/Context/videoConference.context';
import { SessionServices } from '@/services/client/session.client';
import { toast } from 'react-toastify';
import { Session } from '@/types/sessionTypes';
import { IGroupType } from '@/types/groupTypes';
import WhiteBoard from './WhiteBoard';
import { WhiteBoardProvider } from '@/Context/whiteBoardContex';
import { SocketProvider } from '@/Context/socketContext';

const SessionContent: React.FC<{session : Session}> = ({session}) => {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('video');
    const [chatOpen, setChatOpen] = useState(true);
    const [activeChatTab, setActiveChatTab] = useState('chat');
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [micEnabled, setMicEnabled] = useState(true)
    const [videoEnabled, setVideoEnabled] = useState(true)
    const { leaveRoom } = useVideoCall()



    // Sample participants and chat messages (unchanged)
    const participants = [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
        { id: 3, name: "User 3" },
        { id: 4, name: "User 4" },
        { id: 5, name: "User 5" },
        { id: 6, name: "User 6" },
        { id: 7, name: "User 7" },
        { id: 8, name: "User 8" },
    ];

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const windowHeight = window.innerHeight
            const mouseY = event.clientY
            const threshold = 100

            if (windowHeight - mouseY <= threshold) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        };

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [])

    const chatMessages = [
        { id: 1, sender: "Joe", time: "8:23 PM", message: "Hai guys" },
        { id: 2, sender: "John", time: "8:23 PM", message: "Hello.... guys Should we start???" },
    ]

    const handleLeave = () => {
        leaveRoom()
        router.push('/dashboard/sessions')
    }

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white">
            {/* Header */}
            <div className="p-5 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1 sm:mb-0">Brain Sync</div>
                <div className="text-center">
                    {/* <div className="text-xl">{session.sessionName || "Session Name"} </div>
                    <div className="text-sm text-gray-400">{session.subject  || "Session Subject"}</div> */}
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <div className="bg-gray-800 rounded-full px-4 py-1 flex items-center border border-cyan-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        <span>{(session?.groupId as IGroupType)?.members?.length  || "5 Members"}</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-4">
                <div className="flex gap-2 flex-wrap">
                    <button
                        className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'video' ? 'bg-cyan-900 text-cyan-400' : 'bg-gray-800'}`}
                        onClick={() => setActiveTab('video')}
                    >
                        <Video className="mr-2 h-4 w-4" /> Video Call
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'whiteboard' ? 'bg-cyan-900 text-cyan-400' : 'bg-gray-800'}`}
                        onClick={() => setActiveTab('whiteboard')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 3a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        WhiteBoard
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'code' ? 'bg-cyan-900 text-cyan-400' : 'bg-gray-800'}`}
                        onClick={() => setActiveTab('code')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Code Editor
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg flex items-center ${activeTab === 'notes' ? 'bg-cyan-900 text-cyan-400' : 'bg-gray-800'}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                        Notes
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="px-4 pb-4 flex flex-col md:flex-row gap-4 h-[calc(100vh-150px)]">
                <div className="flex-grow relative">
                    {/* Always render VideoConference, hide it with CSS when not active */}
                    <div className={`${activeTab === 'video' ? 'block' : 'hidden'} h-full`}>
                        <VideoConference isAudioEnabled={micEnabled} isVideoEnabled={videoEnabled} />
                    </div>
                    <div className={`${activeTab === 'whiteboard' ? 'block' : 'hidden'} h-full`}>
                        <WhiteBoard />
                    </div>
                    {/* Other tabs */}
                  
                    <div className={`${activeTab === 'code' ? 'block' : 'hidden'} h-full flex items-center justify-center bg-gray-800 rounded-lg border border-cyan-500`}>
                        <p className="text-gray-400">Code editor will appear here</p>
                    </div>
                    <div className={`${activeTab === 'notes' ? 'block' : 'hidden'} h-full flex items-center justify-center bg-gray-800 rounded-lg border border-cyan-500`}>
                        <p className="text-gray-400">Notes will appear here</p>
                    </div>
                </div>

            </div>

            {/* Bottom Controls */}
            <div
                className={`absolute bottom-0 left-0 right-0 flex justify-center bg-transparent transition-all duration-300 ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
            >
                <div className="flex gap-2 bg-[#15166b0f] p-2 px-12 rounded-4xl border border-cyan-500 backdrop-blur-md mb-5">
                    <button
                        onClick={() => setActiveTab('video')}
                        className={`p-4 rounded-full ${activeTab === 'video' ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                        <Video className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setActiveTab('whiteboard')}
                        className={`p-4 rounded-full ${activeTab === 'whiteboard' ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 3a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setActiveTab('code')}
                        className={`p-4 rounded-full ${activeTab === 'code' ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setActiveTab('notes')}
                        className={`p-4 rounded-full ${activeTab === 'notes' ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>


                    <span className="w-0.5 bg-cyan-500 ml-2 mr-2 rounded-2xl"></span>
                    <button
                        onClick={() => setVideoEnabled(!videoEnabled)}
                        className={`p-4 rounded-full ${videoEnabled ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                        {videoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                    </button>
                    <button
                        onClick={() => setMicEnabled(!micEnabled)}
                        className={`p-4 rounded-full ${micEnabled ? 'bg-cyan-500' : 'bg-gray-700'}`}
                    >
                        {micEnabled ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                    </button>
                    <button className="p-4 rounded-full bg-red-500">
                        <LogOut className="h-6 w-6" onClick={handleLeave} />
                    </button>
                </div>
            </div>

            {/* Mobile Chat Toggle */}
            {/* <div className="fixed bottom-4 right-4 md:hidden">
                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className="p-2 rounded-full bg-cyan-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div> */}
        </div>
    );
};
interface PageProps {
    sessionCode: string;
    validationRes: { status: true, message: string };
    session : Session
}

const Page: React.FC<PageProps> = ({ sessionCode, validationRes, session }:
    {
        sessionCode: string,
        validationRes: { status: true, message: string },
        session : Session
    }) => {
    const router = useRouter()
    useEffect(() => {
        if (!validationRes.status) {
            toast.error(validationRes.message)
            router.push('/dashboard/sessions')
        }
    }, [validationRes])
    return (
         <SocketProvider>
        <VideoCallProvider roomId={sessionCode as string}>
            <WhiteBoardProvider roomId={sessionCode as string}>
            <SessionContent  session={session}/>
            </WhiteBoardProvider>
        </VideoCallProvider>
        </SocketProvider>
    );
};
export default Page;