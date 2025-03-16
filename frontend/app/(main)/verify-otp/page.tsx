'use client'
import Button from '@/Components/Button/Button';
import Input from '@/Components/Input/Input';
import { useAuth } from '@/Context/auth.context';
import { AuthServices } from '@/services/client/auth.client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('')
  const [timer, setTimer] = useState(60)
  const email = sessionStorage.getItem("email")
  const { user, loading , checkAuth } = useAuth()
  useEffect(() => {
    if (user) {
      console.log(user)
      router.push('/')
    }
  }, [user, loading])

  useEffect(() => {
    if (!email) {
      router.push('/signup')
    }
  }, [email])

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer((time => time - 1))
      }, 1000)
    }
  }, [timer])


  const router = useRouter()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      console.log(email,otp)
      await AuthServices.verifyOtp(otp, email as string)
      checkAuth()
      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const resendOtp = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await AuthServices.resendOtp(email as string)
      setTimer(60)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="container mx-auto px-4">


        {/* Sign Up Form */}
        <div className="max-w-4xl mx-auto my-12 bg-gray-900 rounded-lg p-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className=' text-center'>
              <h1 className="text-4xl font-bold mb-4">Enter Your OTP</h1>
              <p className="text-gray-400 mb-6 ">Fill in the OTP that has been sent to your email.</p>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <Input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={handleInputChange}
                    placeholder="Enter Your OTP"
                    disabled={timer == 0}
                  />
                </div>
                <div className='text-start'>
                </div>
                {
                  timer > 0 ? <Button
                    type="submit"
                    className="w-full py-3  bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-md transition duration-300"
                  >
                    Verify and Proceed
                  </Button> : <Button
                    type="button"
                    onClick={resendOtp}
                    className="w-full py-3  bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-md transition duration-300"
                  >
                    Resend
                  </Button>
                }



                <div className="flex items-center justify-between mt-6">
                  <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
                    Back
                  </Link>
                  <Link href="" className="text-cyan-400 hover:text-cyan-300">
                    00:{timer}
                  </Link>
                </div>
              </form>
            </div>
            <hr className='md:hidden lg:hidden' />

            <div className="flex flex-col justify-center ">
              <h2 className="text-3xl font-bold text-center">
                Join <span className="text-cyan-400 ">BrainSync</span>!
              </h2>
              <p className="text-gray-400 mt-2 text-center">
                Create an account to unlock collaborative study tools and resources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}