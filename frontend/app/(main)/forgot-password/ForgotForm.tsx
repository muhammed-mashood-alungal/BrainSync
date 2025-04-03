'use client'
import React from 'react'
import Button from '@/Components/Button/Button';
import Input from '@/Components/Input/Input';
import { AuthServices } from '@/services/client/auth.client';
import { validateEmail, validateLoginForm } from '@/validations';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/Context/auth.context';
import InPageLoading from '@/Components/InPageLoading/InPageLoading';


function ForgotForm() {
    const { user } = useAuth()

    useEffect(() => {
        if (user) {
            console.log(user)
            router.push('/')
        }
    }, [user])

    const [loading, setLoading] = useState(false)


    const [email, setEmail] = useState('')
    const [emailErr, setEmailErr] = useState('')

    const router = useRouter()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setEmailErr('')
        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    }


    return (
        <>

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
                {
                    loading ? <InPageLoading /> : <Button
                        type="submit"
                        className="w-full py-3  bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-md transition duration-300"
                    >
                        Reset Password
                    </Button>

                }

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



            </form>
        </>
    )
}

export default ForgotForm