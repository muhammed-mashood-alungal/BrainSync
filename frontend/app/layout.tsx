import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo } from "next/font/google";
import "./globals.css";
import Navbar from "@/Components/Navbar/Navbar";
import { AuthProvider } from "../Context/auth.context";
import ToastProvider from "@/Components/Toast/Toast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-archivo',
})

export const metadata : Metadata = {
  title: "Brain Sync",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${archivo.variable} antialiased`}
      >
        <ToastProvider/>
        <AuthProvider>
          {children}
        </AuthProvider>
        
      </body>
    </html>
  );
}
