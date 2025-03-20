'use client'
import { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, LogOut, Send, FileVideo2Icon } from 'lucide-react';

export default function SessionInterface() {
    const [activeTab, setActiveTab] = useState('video');
    const [currentTime, setCurrentTime] = useState('');
    const [micEnabled, setMicEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [chatOpen, setChatOpen] = useState(true);
    const [activeChatTab, setActiveChatTab] = useState('chat');
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [mouseIdle, setMouseIdle] = useState(true);

    // Track mouse movement and position
    useEffect(() => {
        let idleTimer: ReturnType<typeof setTimeout>;

        const handleMouseMove = (e: MouseEvent) => {
            const bottomThreshold = window.innerHeight - 10;
            if (e.clientY > bottomThreshold) {
                setIsVisible(true);
                setMouseIdle(false);
                clearTimeout(idleTimer);
            } else {
                clearTimeout(idleTimer)
                idleTimer = setTimeout(() => {
                    setIsVisible(false);
                    setMouseIdle(true);
                }, 100)
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Hide controls on initial load
        setIsVisible(false);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(idleTimer);
        };
    }, []);


    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        }, 1000)

        return () => clearInterval(timer);
    }, []);

    // Sample participants
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

    // Sample chat messages
    const chatMessages = [
        { id: 1, sender: "Joe", time: "8:23 PM", message: "Hai guys" },
        { id: 2, sender: "John", time: "8:23 PM", message: "Hello.... guys Should we start???" },
    ];

    const renderMainContent = () => {
        switch (activeTab) {
            case 'video':
                return (
                    <div className="flex flex-col h-full">
                        <div className="flex-grow relative">
                            <div className="absolute inset-0 bg-[#1E1E1E] rounded-lg border border-cyan-500">
                                {/* Main video (host) */}
                                <div className="w-full h-full flex items-center justify-center">
                                    <p className="text-gray-400">Host's video will appear here</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 mt-2">
                            {/* Participant video tiles */}
                            {participants.map(participant => (
                                <div key={participant.id} className="bg-gray-800 rounded-md h-20 flex items-center justify-center">
                                    <p className="text-xs text-gray-400">{participant.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'whiteboard':
                return (
                    <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg border border-cyan-500">
                        <p className="text-gray-400">Whiteboard content will appear here</p>
                    </div>
                );
            case 'code':
                return (
                    <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg border border-cyan-500">
                        <p className="text-gray-400">Code editor will appear here</p>
                    </div>
                );
            case 'notes':
                return (
                    <div className="h-full flex items-center justify-center bg-gray-800 rounded-lg border border-cyan-500">
                        <p className="text-gray-400">Notes will appear here</p>
                    </div>
                );
            default:
                return null;
        }
    };
 
    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white ">
            {/* Top bar */}
            <div className="bg-[#1E1E1E] p-5 flex flex-col sm:flex-row justify-between items-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1 sm:mb-0">Brain Sync</div>
                <div className="text-center">
                    <div className="text-xl">DSA Revision</div>
                    <div className="text-sm text-gray-400">(DSA)</div>

                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <div className="bg-gray-800 rounded-full px-4 py-1 flex items-center border border-cyan-400">
                        <div className="mr-1 text-cyan-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>8 Members</span>
                    </div>
                    <div className="text-gray-300">{currentTime}</div>
                </div>
            </div>

            {/* Navigation tabs */}
            <div className="bg-[#1E1E1E] px-4 ">
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

            {/* Main content */}
            <div className="px-4 pb-4 flex flex-col md:flex-row gap-4 h-screen max-h-[calc(100vh-150px)] bg-[#1E1E1E]">
                {/* Left: Main content area */}
                <div className="flex-grow">
                    {renderMainContent()}
                </div>

                {/* Right: Chat sidebar */}
                <div className={`w-full  md:w-80 bg-gray-800 rounded-lg transition-all duration-300  max-h-12/12 ${chatOpen ? 'block' : 'hidden'}`}>
                    <div className="p-2">
                        <div className="flex border-b border-gray-700">
                            <button
                                className={`flex-1 p-2 text-center ${activeChatTab === 'chat' ? 'bg-gray-700 rounded-t-lg' : ''}`}
                                onClick={() => setActiveChatTab('chat')}
                            >
                                Chat
                            </button>
                            <button
                                className={`flex-1 p-2 text-center ${activeChatTab === 'participants' ? 'bg-gray-700 rounded-t-lg' : ''}`}
                                onClick={() => setActiveChatTab('participants')}
                            >
                                Participants
                            </button>
                            <button
                                className={`flex-1 p-2 text-center ${activeChatTab === 'options' ? 'bg-gray-700 rounded-t-lg' : ''}`}
                                onClick={() => setActiveChatTab('options')}
                            >
                                Options
                            </button>
                        </div>

                        <div className="h-[calc(100vh-290px)] overflow-y-auto">
                            {activeChatTab === 'chat' && (
                                <div className="p-2">
                                    {chatMessages.map(msg => (
                                        <div key={msg.id} className="mb-4 bg-gray-700 rounded-lg p-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-bold">{msg.sender}</span>
                                                <span className="text-gray-400 text-xs">{msg.time}</span>
                                            </div>
                                            <p className="text-sm mt-1">{msg.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeChatTab === 'participants' && (
                                <div className="p-2">
                                    {participants.map(p => (
                                        <div key={p.id} className="flex items-center p-2 hover:bg-gray-700 rounded">
                                            <div className="w-6 h-6 rounded-full bg-gray-600 mr-2"></div>
                                            <span>{p.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeChatTab === 'options' && (
                                <div className="p-4">
                                    <p className="text-sm">Session options go here</p>
                                </div>
                            )}
                        </div>

                        {activeChatTab === 'chat' && (
                            <div className="p-2 mt-2 flex">
                                <input
                                    type="text"
                                    placeholder="Type a message...."
                                    className="flex-grow bg-gray-700 rounded-full px-4 py-2 text-white focus:outline-none"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button className="ml-2 bg-cyan-500 rounded-full p-2 flex items-center justify-center">
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom controls */}
            <div 
  className={`absolute bottom-0 left-0 right-0 flex justify-center bg-transparent transition-all duration-300 ease-in-out 
    ${isVisible ? 'translate-y-0 opacity-100 visible' : 'translate-y-0 opacity-0 invisible'}`}
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
                        <LogOut className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className="fixed bottom-4 right-4 md:hidden bg-[#1E1E1E]">
                <button
                    onClick={() => setChatOpen(!chatOpen)}
                    className="p-2 rounded-full bg-cyan-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}