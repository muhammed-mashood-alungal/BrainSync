import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSocket } from "./socket.context";

interface Message {
    sender: string,
    text: string,
    time: string
}
interface ChatContextProvider {
    messages: Message[]
    sendMessage: (sender: string, text: string, time: string) => void
}

const ChatContext = createContext<ChatContextProvider | undefined>(undefined)


export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const { socket } = useSocket()
    const [messages, setMessages] = useState<Message[]>([])
    useEffect(() => {
        if (!socket) return
        socket.on('message', (messageData: Message) => {
            setMessages((prev) => {
                return [...prev, messageData]
            })
        })
    }, [socket])

    const sendMessage = (sender: string, text: string, time: string) => {
        socket?.emit('send-message',{sender , text , time})
        setMessages((prev) => {
            return [...prev, {sender , text , time}]
        })
    }
    return (
      <ChatContext.Provider value={{sendMessage , messages}}>
        {children}
      </ChatContext.Provider>
    )
}

export const useChat =()=>{
    const context = useContext(ChatContext)
    if(!context){
        throw Error("Please Use the context after wrapping it!")
    }
    return context
}