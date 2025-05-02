// components/Navbar.jsx
'use client'
import {  useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/Context/auth.context';
import { AuthServices } from '@/services/client/auth.client';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user,checkAuth} = useAuth()
  const router = useRouter()
  const logout =async () => {
     try{
      
        await AuthServices.logout()
        checkAuth()
     }catch(err){
      console.log(err)
        toast.error("Logout Failed")
     }
  }
  const handleGoToDashboard = () => {
    // Check if the accessToken cookie exists
    const accessToken = document?.cookie?.split('; ').find(row => row.startsWith('accessToken='));
  
    if (accessToken) {
      // If accessToken exists, redirect to dashboard
      router.push('/dashboard');
    } else {
      // If accessToken doesn't exist, you can handle it differently, maybe show a message or handle login
      toast.error("You are not logged in.");
    }
  };

  return (
    <nav className="py-4 px-4 md:px-12 bg-black text-white ">
      <div className="flex flex-wrap justify-between items-center ">

        <div className="text-2xl md:text-3xl font-bold">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300">
            Brain Sync
          </Link>
        </div>

        <button
          className="block md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="w-6 h-6 hover:cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 hover:cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/premium-plans" className="hover:text-gray-300">
            Premium
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About Us
          </Link>
          {
            user ? <>
              <button  onClick={logout} className="text-cyan-400 hover:text-cyan-300">
                Logout
              </button>
              <button onClick={handleGoToDashboard} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full">
                Go to Dashboard
              </button>
            </> : <>
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300" prefetch={false} >
                Login
              </Link>
              <Link href="/signup" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full" prefetch={false}>
                Sign Up
              </Link>
            </>

          }

        </div>
      </div>

      {/* Mobile navigation menu */}
      {isMenuOpen && (
        <div className="md:hidden w-full mt-4 space-y-1 absolute bg-black pb-2">
          <Link href="/" className="block hover:text-gray-300 py-2">
            Home
          </Link>
          <Link href="/features" className="block hover:text-gray-300 py-2">
            Features
          </Link>
          <Link href="/about" className="block hover:text-gray-300 py-2">
            About Us
          </Link>
          <div className="flex flex-col space-y-3 pt-2">
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 py-2">
              Login
            </Link>
            <Link href="/signup" className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-center w-30 ">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;