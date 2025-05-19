'use client'
import Button from '@/Components/Button/Button';
import Input from '@/Components/Input/Input';
import { AuthServices } from '@/services/client/auth.client';
import { validateResetPasswords } from '@/validations';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/Context/auth.context';


function ResetForm() {

    const { user } = useAuth()
    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user])

    const [password, setPassword] = useState('')
    const [passwordErr, setPasswordErr] = useState('')
    const [confirmPass , setConfirmPass] = useState('')
    const [confirmPassErr , setConfirmPassErr] = useState('')



    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams?.get('token')

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        try {
            const result = validateResetPasswords(password,confirmPass)
            if (result.status) {
                await AuthServices.resetPassword(token  as string, password)
                router.push('/login')
            } else {
                if(result.err?.password) setPasswordErr(result.err.password)
                if(result.err?.confirmPassword) setConfirmPassErr(result.err.confirmPassword)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("An unexpected error occurred.")
            }
        }

    }

    return (
        <>
            <div className=' text-center'>
                <h1 className="text-4xl font-bold mb-4">Reset Password</h1>
                <p className="text-gray-400 mb-6 ">Enter Your New Password Here</p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className='text-start'>
                        <Input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New Password"
                        />
                        <span className='text-red-600 ml-1'  > {passwordErr}</span>
                    </div>
                    <div className='text-start'>
                        <Input
                            type="password"
                            name="confirmPass"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            placeholder="Confirm Password"
                        />
                        <span className='text-red-600 ml-1'  > {confirmPassErr}</span>
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
        </>
    )
}

export default ResetForm