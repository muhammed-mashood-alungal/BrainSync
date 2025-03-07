'use client'
import Button from '@/Components/Button/Button';
import Input from '@/Components/Input/Input';
import Link from 'next/link';
import { useState } from 'react';

export default function VerifyOtp() {
  const [otp , setOtp ] = useState('')

  const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = (e : React.SyntheticEvent) => {
    e.preventDefault();
    console.log('Form submitted:');
  };

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
                    />
                </div>
               <div className='text-start'>
               </div>
               
                <Button
                  type="submit"
                  className="w-full py-3  bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-md transition duration-300"
                >
                  Verify and Proceed 
                </Button>
                
                <div className="flex items-center justify-between mt-6">
                  <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
                    Back
                  </Link>
                </div>
              </form>
            </div>
            <hr  className='md:hidden lg:hidden'/>
            
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