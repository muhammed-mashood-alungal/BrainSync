"use client"; 

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthServices } from "@/services/authServices";


interface User {
   id: string;
   role: string;
   email: string;
}

interface AuthContextType {
  user: User | null
  loading: boolean,
  checkAuth : Function
}


const AuthContext = createContext<AuthContextType>({user : null , loading : false , checkAuth :Function})


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  const checkAuth = async () => {
    try {
      const res : User = await AuthServices.authMe()
      console.log(res)
      setUser(res)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading  ,checkAuth}}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext)