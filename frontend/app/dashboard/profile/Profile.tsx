'use client'
import ImageCropModal from '@/Components/CropImage/CropImage';
import Input from '@/Components/Input/Input';
import BaseModal from '@/Components/Modal/Modal';
import { useAuth } from '@/Context/auth.context';
import { UserServices } from '@/services/client/user.client';
import { IuserSignUp } from '@/types/userSignUp.types';
import { validateResetPasswords } from '@/validations';
import Link from 'next/link'
import { ChangeEvent, use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Trash } from "lucide-react";
import { AuthServices } from '@/services/client/auth.client';
import { useRouter } from 'next/navigation';

function Profile() {
    const { user, checkAuth } = useAuth()
    const [userData, setUserData] = useState<{ username: string, email: string, profilePic: string } | null>(null)
   
    const data = [
        { name: 'Jan', '2022': 80, '2023': 40, '2024': 80 },
        { name: 'Feb', '2022': 35, '2023': 15, '2024': 60 },
        { name: 'Mar', '2022': 70, '2023': 20, '2024': 40 },
        { name: 'Apr', '2022': 15, '2023': 35, '2024': 70 },
        { name: 'May', '2022': 60, '2023': 95, '2024': 50 },
        { name: 'Jun', '2022': 70, '2023': 80, '2024': 60 },
        { name: 'Jul', '2022': 35, '2023': 60, '2024': 10 },
        { name: 'Aug', '2022': 75, '2023': 50, '2024': 90 },
        { name: 'Sep', '2022': 60, '2023': 10, '2024': 90 },
        { name: 'Oct', '2022': 80, '2023': 60, '2024': 90 },
        { name: 'Nov', '2022': 35, '2023': 85, '2024': 30 },
        { name: 'Dec', '2022': 30, '2023': 95, '2024': 80 },
    ];

    const stats = [
        { value: '12', label: 'Total Session' },
        { value: '78 hr', label: 'Time Spend' },
        { value: '5', label: 'Groups Active' },
        { value: '62', label: 'Resources Saved' },
    ]

    useEffect(() => {
        async function fetchUserData() {
            if (user) {
                const data = await UserServices.getUserData(user.id)
                setUserData(data)
                if (data.profilePicture) {
                    setPreview(data.profilePicture?.url)
                }
                setNewUsername(data.username)
            }
        }
        fetchUserData()
    }, [user])

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isNameEditOn, setIsNameEdit] = useState(false)
    const [isChangePass, setIsChangePass] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const [newUsername, setNewUsername] = useState('')
    const [pass, setPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [oldPass, setOldPass] = useState('')
    const [changePassErr, setChangePassErr] = useState({
        oldPass: '',
        password: '',
        confirmPassword: ''
    })
    const router = useRouter()

    const handleImageDelete = async () => {
        try {
            await UserServices.deleteProfilePic(user?.id as string)
            setPreview(null)
            toast.success('Profile Picture Deleted Successfully')
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.name)
            }
        }

    }



    const editUsername = async () => {
        try {
            if (newUsername.trim() == '') {

                return toast.error("Plese Provide a Username")
            }
            if (newUsername == userData?.username) {
                return toast.error('Nothing To Update')
            }
            await UserServices.editUsername(user?.id as string, newUsername)

            toast.success("Username Updated Successfully")
            setUserData({ ...userData, username: newUsername } as { username: string, email: string, profilePic: string })
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message)
            } else {
                toast.error("Unexpected Error Occured")
            }
        } finally {
            setIsNameEdit(false)
        }
    }


    const setProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            setSelectedFile(file)
            setIsModalOpen(true)
        }
    }
    const handleSaveCroppedImage = async (croppedFile: File) => {
        setIsUploading(true)

        try {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(croppedFile)
            const formData = new FormData()
            formData.append('image', croppedFile)
            await UserServices.changeProfilePic(formData, user?.id as string)

            toast.success("Profile Picture Changed Successfully")
        } catch (error) {
            console.error('Error uploading image:', error)
        } finally {
            setIsUploading(false)
        }
    }

    const changePassword = async () => {
        setChangePassErr({ oldPass: '', password: '', confirmPassword: '' })
    
        if (oldPass.trim() === '') {
            setChangePassErr(prev => ({ ...prev, oldPass: "Please Enter Your Old Password" }))
            return
        }
    
        const res = validateResetPasswords(pass, confirmPass)
    
        if (res.status) {
            try {
                await UserServices.changePassword(user?.id as string, oldPass, pass)
                toast.success('Password Changed Successfully')
            } catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message)
                } else {
                    toast.error("An unexpected error occurred.")
                }
            } finally {
                setOldPass('')
                setPass('')
                setConfirmPass('')
                setIsChangePass(false)
            }
        } else {
            setChangePassErr(prev => ({ ...prev, ...res.err }))
        }
    }
    
    const logout = async () => {
        try {
            await AuthServices.logout()
            checkAuth()
            router.push('/login')
        } catch (err) {
            toast.error("Logout Failed")
        }
    }

    return (
        <>

            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">My Profile</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={logout} className="text-[#00D2D9] hover:underline">
                            Logout
                        </button>
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img
                                src={preview ? preview : "/profilePic.png"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Profile info card */}
                <div className="bg-[#2B2B2B] rounded-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#00D2D9]">
                                <label htmlFor="profile-image"  >
                                    <img
                                        src={preview ? preview : "/profilePic.png"}
                                        alt="Profile"
                                        className="w-full h-full object-cover hover:cursor-pointer"
                                    />
                                </label>

                            </div>
                            <input type="file" hidden id='profile-image' onChange={setProfilePhoto} />
                            {
                                preview && <label onClick={handleImageDelete} className="absolute bottom-0 right-0 bg-[#00D2D9] text-white rounded-full p-1 hover:cursor-pointer">
                                    <Trash size={15} />
                                </label>
                            }


                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white">{userData?.username}</h2>
                            <p className="text-gray-400">{userData?.email}</p>
                        </div>

                        <button className="bg-[#00D2D9] text-[#1E1E1E] px-4 py-2 rounded-lg font-medium hover:cursor-pointer"
                            onClick={() => setIsNameEdit(true)}
                        >
                            Edit Username
                        </button>
                        <button className="bg-[#00D2D9] text-[#1E1E1E] px-4 py-2 rounded-lg font-medium hover:cursor-pointer"
                            onClick={() => setIsChangePass(true)}
                        >
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Study Statistics */}
                <div className="bg-[#2B2B2B] rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-6">Study Statistics</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <p className="text-4xl font-bold text-[#00D2D9]">{stat.value}</p>
                                <p className="text-white">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Chart */}
                <div className="bg-[#2B2B2B] rounded-lg p-6">
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                                    labelStyle={{ color: '#fff' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="2022" stroke="#7547F7" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="2023" stroke="#FF6B6B" activeDot={{ r: 8 }} />
                                <Line type="monotone" dataKey="2024" stroke="#00D2D9" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <ImageCropModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCroppedImage}
                aspect={1} // 1:1 aspect ratio for profile pictures
                imageFile={selectedFile}
            />

            <BaseModal
                isOpen={isNameEditOn}
                onClose={() => setIsNameEdit(false)}
                onSubmit={editUsername}
                title="Edit User Name"
                submitText="Update"
                size="md"
            >
                <div className="mt-2">
                    <Input
                        type="text"
                        name=''
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="Enter Your new Username"
                        className="w-full p-3 bg-[#333333] text-white rounded-md border border-gray-600 focus:border-[#00D2D9] focus:outline-none"
                    />
                </div>
            </BaseModal>

            <BaseModal
                isOpen={isChangePass}
                onClose={() => setIsChangePass(false)}
                onSubmit={changePassword}
                title="Edit User Name"
                submitText="Update"
                size="md"
            >
                <div className="mt-2">
                    <Input
                        type="text"
                        name=''
                        value={oldPass}
                        onChange={(e) => setOldPass(e.target.value)}
                        placeholder="Enter Your Old"
                        className="w-full p-3 bg-[#333333] text-white rounded-md border border-gray-600 focus:border-[#00D2D9] focus:outline-none"
                    />
                    <span className='text-red-600 ml-1'  > {changePassErr?.oldPass}</span>
                </div>
                <div className="mt-2">
                    <Input
                        type="text"
                        name=''
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        placeholder="Enter Your new Password"
                        className="w-full p-3 bg-[#333333] text-white rounded-md border border-gray-600 focus:border-[#00D2D9] focus:outline-none"
                    />
                    <span className='text-red-600 ml-1'  > {changePassErr?.password}</span>
                </div>
                <div className="mt-2">
                    <Input
                        type="text"
                        name=''
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="Confrim Your Password"
                        className="w-full p-3 bg-[#333333] text-white rounded-md border border-gray-600 focus:border-[#00D2D9] focus:outline-none"
                    />
                    <span className='text-red-600 ml-1'  > {changePassErr?.confirmPassword}</span>
                </div>
            </BaseModal>

        </>
    )
}

export default Profile