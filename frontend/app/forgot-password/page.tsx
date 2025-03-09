'use client'
import Button from '@/Components/Button/Button';
import Input from '@/Components/Input/Input';
import { AuthServices } from '@/services/authServices';
import { validateEmail, validateLoginForm } from '@/validations';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/Context/auth.context';

export default function ForgotPassword() {
    const { user, loading  } = useAuth()
    useEffect(() => {
        if (user) {
            console.log(user)
            router.push('/')
        }
    }, [user, loading])

    const [email, setEmail] = useState('')
    const [emailErr, setEmailErr] = useState('')

    const router = useRouter()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            let result = validateEmail(email)
            if (result.status) {
                const response = await AuthServices.forgotPassword(email)
                toast.success(response.message)
            } else {
                setEmailErr(result.err)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("An unexpected error occurred.")
            }
        }

    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="container mx-auto px-4">


                {/* Sign Up Form */}
                <div className="max-w-4xl mx-auto my-12 bg-gray-900 rounded-lg p-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className=' text-center'>
                            <h1 className="text-4xl font-bold mb-4">Forgot Password</h1>
                            <p className="text-gray-400 mb-6 ">Enter Your Email to reset the Password</p>

                            <form onSubmit={handleSubmit} className="space-y-4">

                                <div className='text-start'>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                    />
                                    <span className='text-red-600 ml-1'  > {emailErr}</span>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full py-3  bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-md transition duration-300"
                                >
                                    Reset Password
                                </Button>


                                </form>

                                <div className="flex items-center justify-between mt-6">
                                    <div className='text-start'>
                                        <Link href="" onClick={() => router.back()} className="text-cyan-400 hover:text-cyan-300   mb-4">
                                            Back
                                        </Link>
                                    </div>
                                    <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
                                        Create a new account
                                    </Link>
                                </div>
                          
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