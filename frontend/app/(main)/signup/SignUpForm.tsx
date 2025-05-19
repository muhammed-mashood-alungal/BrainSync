'use client'

import { useAuth } from '@/Context/auth.context';
import { AuthServices } from '@/services/client/auth.client';
import { validateSignUpForm } from '@/validations';
import { useRouter, useSearchParams } from 'next/navigation';
import {useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '@/Components/Button/Button';
import Input from '@/Components/Input/Input';
import Link from 'next/link';
import InPageLoading from '@/Components/InPageLoading/InPageLoading';


function SignUpForm() {
  const router = useRouter()
  const { user } = useAuth()
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user,router])
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()


  useEffect(() => {
    const error = searchParams?.get('$error')
    if (error) {
      toast.error(error)
    }
  }, [searchParams])

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formDataErr, setFormDataErr] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setFormDataErr({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setLoading(true)
    try {
      const result = validateSignUpForm(formData)
      if (result.status) {
        await AuthServices.registerService(formData)
        sessionStorage.setItem('email', formData.email)
        router.push('/verify-otp')
      } else {
        setFormDataErr(result.err)
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false)
    }

  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='ml-1 text-start'>
          <Input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Username" />
          <span className='text-red-600 '  >{formDataErr?.username}</span>
        </div>

        <div className='ml-1 text-start'>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"

          />
          <span className='text-red-600'>{formDataErr?.email}</span>
        </div>


        <div className='ml-1 text-start'>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
          <span className='text-red-600'>{formDataErr?.password}</span>
        </div>

        <div className='ml-1 text-start' >
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
          />
          <span className='text-red-600'>{formDataErr?.confirmPassword}</span>
        </div>
        {
          loading ? <InPageLoading /> : <Button
            type="submit"
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-md transition duration-300"
          >
            Create Account
          </Button>
        }


        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={AuthServices.googleAuth}
            className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-full hover:bg-gray-800"
          >
            Google
          </button>
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300">
            Log in to existing account
          </Link>
        </div>
      </form>
    </>
  )
}

export default SignUpForm