import Navbar from "@/Components/Navbar/Navbar";
import { ReactNode } from "react";

export  default function  MainLayout({children } : {children : ReactNode}){
    return (
        <>
        <Navbar/>
        {children}
        </>
    )
}