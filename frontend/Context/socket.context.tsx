import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './auth.context';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const {user} = useAuth()
  useEffect(() => {
    if(!user?.email) return
    const socketConnection = io(process.env.NEXT_PUBLIC_BACKEND_ROOT_URL!);
    setSocket(socketConnection);
    console.log('Socket connected')
    return () => {
      socketConnection.disconnect();
    };
  }, [user?.email]);

  return (
    <SocketContext.Provider value={{ socket  }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};