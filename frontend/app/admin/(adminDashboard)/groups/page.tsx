'use client'
import React, { useEffect, useReducer, useState } from 'react';
import Image from 'next/image';
import BaseModal from '@/Components/Modal/Modal'
import Input from '@/Components/Input/Input';
import { validateCreateGroup } from '@/validations';
import { GroupServices } from '@/services/groupServices';
import { useAuth } from '@/Context/auth.context';
import { toast } from 'react-toastify';
import { UserServices } from '@/services/userServices';
import { IUserType } from '@/types/userTypes';
import { IGroupType } from '@/types/groupTypes';


type Member = {
    id: string;
    color: string;
    name?: string;
}

type Group = {
    _id: string;
    name: string;
    createdBy?: IUserType;
    members: IUserType[];
    sessionsCompleted: number;
    nextSessionDate: string;
}

const GroupsPage: React.FC = () => {
    const [groups, setGroups] = useState<IGroupType[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [memberEmail, setMemberEmail] = useState('')
    const { user } = useAuth()
    const [selectedMembers, setSelectedMembers] = useState<IUserType[]>([])
    const [selectedGroup, setSelectedGroup] = useState('')

    const [err, setErr] = useState({
        groupName: '',
        members: ''
    })
    useEffect(() => {
        async function fetchGroups() {
            const res = await GroupServices.getAllGroups()
            setGroups(res)
        }
        fetchGroups()
    }, [])


   
    const deactivate = async(groupId : string)=>{
        try {
            await GroupServices.deactivate(groupId)
            toast.success("Deactivated Group Successfully")
        }  catch (error: unknown) {
            if (err instanceof Error) {
                toast.error(err.message)
            } else {
                toast.error("Unexpected Error Occured")
            }
        } finally {
            closeModal()
        }
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setNewGroupName('');
        setMemberEmail('');
        setSelectedMembers([]);
    }

    return (
        <div className="flex-1 min-h-screen bg-[#1E1E1E] text-white p-6 ml-1">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Groups</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#8979FF] hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                    Create Group
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups?.map((group) => (
                    <div key={group._id} className="bg-zinc-900 border text-[#8979FF] rounded-lg overflow-hidden">
                        <div className="bg-[#8979FF] p-3 text-center">
                            <h2 className="text-xl font-semibold text-white">{group.name}</h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300 text-sm">{group.members.length} Members</span>
                                    <a href="#" className="text-[#8979FF] text-xs hover:underline">view all</a>
                                </div>
                                <div className="flex items-center">
                                    {group.members.slice(0, 5).map((member) => (
                                        <div
                                            key={member._id}
                                            className="w-8 h-8 rounded-full mr-1 flex items-center justify-center text-xs font-bold"
                                        >
                                            <img src={member?.profilePicture?.url || "/profilePic.png"} alt="" className='h-8 w-8 rounded-2xl' />
                                        </div>
                                    ))}
                                    {group.members.length > 5 && (
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs">
                                            +{group.members.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="text-sm text-gray-300 mb-2">
                                Admin :  <span className="text-[#8979FF]">  {group.createdBy?.username} </span> {group.createdBy?._id == user?.id && '(You)'}
                            </div>
                            <div className="text-sm text-gray-300 mb-4">
                                Next Session: {"Not Assigned"}
                            </div>
                            {group.isActive ? <button className=" bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md text-sm transition duration-200"
                                onClick={() =>deactivate(group._id)}
                            >
                                Deactivate
                            </button> :  <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-md text-sm transition duration-200"
                             onClick={()=>deactivate(group._id)}
                            >
                               Activate
                            </button>
                            }

                        </div>
                    </div>
                ))}
            </div>




        </div>
    );
};

export default GroupsPage;