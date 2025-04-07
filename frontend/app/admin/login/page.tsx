'use client'
import { AuthServices } from '@/services/client/auth.client';
import { validateLoginForm } from '@/validations';
import React, { SyntheticEvent, use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/Context/auth.context';

const AdminPortal = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState({
        email: '',
        password: ''
    })
    const router = useRouter()
    const { user, checkAuth } = useAuth()
    const [loading , setLoading] = useState(false)
 
    useEffect(()=>{
        console.log(user)
       if(user && user.role == 'admin'){
        router.push('/admin/students')
       }else if(user){
        router.push('/')
       }
    },[user])


    const handleSubmit = async (e: SyntheticEvent) => {
        setLoading(true)
        try {
            e.preventDefault()
            
            const res = validateLoginForm({ email, password })
            if (res.status) {
                await AuthServices.loginService({ email, password })
                checkAuth()
                console.log(user)
                if (user?.role != 'admin') {
                    router.push('/')
                    return
                } else {
                    toast.success('Login Success')
                    
                    router.push('/admin/students')
                }

            } else {
                setErr(res.err)
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("An unexpected error occurred.")
            }
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="w-full max-w-md p-6 rounded-lg bg-zinc-900">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-white mb-1">Admin Portal</h1>
                    <p className="text-gray-400 text-sm">Enter Your credential to access the dashboard</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-300 mb-2">
                            email
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Username"
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className='text-red-600 ml-1'  > {err?.email}</span>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Your Password"
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <span className='text-red-600 ml-1'  > {err?.password}</span>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition duration-200"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminPortal;