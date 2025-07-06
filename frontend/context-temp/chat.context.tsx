import { Children, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useSocket } from "./socket.context";

interface Message {
    id:string,
    sender: string,
    text: string,
    time: string
}
interface ChatContextProvider {
    messages: Message[]
    sendMessage: (id : string , sender: string, text: string, time: string) => void
    deleteMessage :(id : string) => void
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

        socket.on('delete-message', (id: string) => {
            setMessages((prev)=>{
                return prev.filter((msg)=>msg.id != id)
            })
        })
    }, [socket])

    const sendMessage = ( id : string , sender: string, text: string, time: string) => {
        socket?.emit('send-message',{id , sender , text , time})
        setMessages((prev) => {
            return [...prev, {id , sender , text , time}]
        })
    }

    const deleteMessage = (id : string)=>{
        socket?.emit('delete-message' , {id})
        setMessages((prev)=>{
            return prev.filter((msg)=>msg.id != id)
        })
    }
    return (
      <ChatContext.Provider value={{sendMessage , messages , deleteMessage}}>
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