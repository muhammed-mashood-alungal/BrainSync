'use client'
import Button from '@/Components/Button/Button';
import Input from '@/Components/Input/Input';
import { AuthServices } from '@/services/authServices';
import { validateLoginForm } from '@/validations';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/Context/auth.context';

export default function LoginPage() {
  const { user, loading  , checkAuth} = useAuth()
  useEffect(() => {
    if (user) {
      console.log(user)
      router.push('/')
    }
  }, [user, loading])
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [formDataErr, setFormDataErr] = useState({
    email: '',
    password: ''
  })

  const router = useRouter()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setFormDataErr({email : '' , password : ''})
    try {
      let result = validateLoginForm(formData)
      if (result.status) {
        await AuthServices.loginService(formData)
        router.push('/')
        checkAuth()
      } else {
        setFormDataErr(result.err)
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
              <h1 className="text-4xl font-bold mb-4">Create An Account</h1>
              <p className="text-gray-400 mb-6 ">Fill in Your Details to get started</p>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className='text-start'>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                  />
                  <span className='text-red-600 ml-1'  > {formDataErr?.email}</span>
                </div>

                <div className='text-start'>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                  />
                  <span className='text-red-600 ml-1'  > {formDataErr?.password}</span>
                </div>
                <div className='text-start'>
                  <Link href="/forgot-password" className="text-cyan-400 hover:text-cyan-300   mb-4">
                    Forgotten Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full py-3  bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-md transition duration-300"
                >
                  Login
                </Button>

                <div className="flex items-center justify-between mt-6">
                  <button
                    type="button"
                    onClick={AuthServices.googleAuth}
                    className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-full hover:bg-gray-800"
                  >
                    Google
                  </button>
                  <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
                    Create a new account
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