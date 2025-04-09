import { useAuth } from '@/Context/auth.context';
import { useChat } from '@/Context/chat.context';
import React, { useState, useRef, useEffect, SyntheticEvent, RefObject } from 'react';


const ChatComponent = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { messages, sendMessage } = useChat()
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const { user } = useAuth()

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const handleSendMessage = (e: SyntheticEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        sendMessage(user?.email as string, newMessage, currentTime)
        setNewMessage('')
    };

    
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            )}

            {/* Chat Interface */}
            {isOpen && (
                <div className="bg-gray-900 rounded-lg shadow-xl w-90 flex flex-col h-[85vh] overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
                        <div className="flex space-x-4">
                            <button className="text-gray-300 hover:text-white">Chat</button>
                            {/* <button className="text-gray-500 hover:text-gray-300">Report</button>
                            <button className="text-gray-500 hover:text-gray-300">Options</button> */}
                        </div>
                        <button
                            onClick={closeChat}
                            className="text-gray-400 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.length > 0 && messages.map((msg, idx) => (
                            <div key={idx} className="bg-gray-800 rounded p-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-s text-white">{msg.sender === user?.email ? 'You' : msg.sender}</span>
                                   
                                    <span className="text-xs text-gray-400">{msg.time}</span>
                                    
                                </div>
                                <p className="text-gray-300 text-sm p-2">{msg.text}</p>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="bg-gray-800 p-2 flex items-center">
                        <input
                            type="text"
                            placeholder="Type a message......"
                            className="bg-gray-700 text-white rounded-full py-2 px-4 flex-1 outline-none"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="ml-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatComponent;