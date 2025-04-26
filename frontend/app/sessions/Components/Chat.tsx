import Confirm from '@/Components/ConfirmModal/ConfirmModal';
import { useAuth } from '@/Context/auth.context';
import { useChat } from '@/Context/chat.context';
import {  Trash } from 'lucide-react';
import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

const ChatComponent = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { messages, sendMessage , deleteMessage} = useChat()
    const [newMessage, setNewMessage] = useState('')
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const { user } = useAuth()
    const [deletingMsg , setDeletingMsg] = useState('')
    const [showPicker, setShowPicker] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const closeChat = () => {
        setIsOpen(false);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
      };

    const handleSendMessage = (e: SyntheticEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        const id = uuidv4()
        console.log('Unique id  is :', id)
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        sendMessage(id , user?.email as string, newMessage, currentTime)
        setNewMessage('')
    };

    const handleDeleteMessage = () =>{
       if(!deletingMsg) return 
       deleteMessage(deletingMsg)
       setDeletingMsg('')
    }

    
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
                            className="text-gray-400 hover:text-white hover:cursor-pointer"
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
                                <div className="flex justify-between items-center ">
                                    <span className="text-xs text-cyan-500">{msg.sender === user?.email ? 'You' : msg.sender}</span>
                                    {
                                        msg.sender == user?.email &&   <span className='hover:cursor-pointer hover:text-red-400' 
                                        onClick={()=>setDeletingMsg(msg.id)}
                                       ><Trash size={14}/>  </span>
                                    }
                                </div>
                                <p className="text-gray-300 text-sm break-words whitespace-pre-wrap pr-2">{msg.text}</p>

                                <div className='flex justify-end'>
                                <span className="text-xs text-gray-400">{msg.time}</span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                   
                    <form onSubmit={handleSendMessage} className="bg-gray-800 p-2 flex items-center">
                        <img src="/happiness_yellow.png" alt="" className='h-6 w-6 mr-1 hover:cursor-pointer' 
                        onClick={() => setShowPicker(!showPicker)}/>
                        <textarea
                           placeholder="Type a message..."
                           className="bg-gray-700 text-white rounded-xl py-2 px-4 flex-1 outline-none resize-none overflow-hidden"
                          rows={1}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendMessage(e)
                        }
                        }}
/>
                        <button
                            type="submit"
                            className="ml-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-2 hover:cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                    {showPicker && (
                    <div className="absolute bottom-12 z-50">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                     )}
     
                </div>
            )}
            <Confirm title='Are Your sure to delete the Message ?' isOpen={Boolean(deletingMsg)} 
             onClose={()=>setDeletingMsg('')} onConfirm={handleDeleteMessage}
            />
        </div>
    );
};

export default ChatComponent;