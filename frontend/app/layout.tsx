import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/auth.context";
import ToastProvider from "@/components/ui/toast/Toast";
import Script from "next/script";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// })

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// })
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  title: "Brain Sync",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Add Razorpay Script asynchronously */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive" // Ensures the script is loaded before interactive
        />
      </head>
      <body className={`${archivo.variable} antialiased`}>
       <ToastProvider/>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
