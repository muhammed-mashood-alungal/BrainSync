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
    const [groups, setGroups] = useState<Group[]>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [memberEmail, setMemberEmail] = useState('')
    const { user } = useAuth()
    const [selectedMembers, setSelectedMembers] = useState<IUserType[]>([])
    const [searchedUsers, setSearchedUsers] = useState<IUserType[]>([])
    const [selectedGroup, setSelectedGroup] = useState('')

    const [err, setErr] = useState({
        groupName: '',
        members: ''
    })
    useEffect(() => {
        async function fetchGroups() {
            const res = await GroupServices.getMyGroups(user?.id as string)
            setGroups(res.groups as [])
        }
        fetchGroups()
    }, [])
    const handleMemberEmailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setMemberEmail(e.target.value)
        const res = await UserServices.searchUser(e.target.value)
        setSearchedUsers(res.users)
    }

    const addMember = (usr: IUserType) => {
        if (!selectedMembers.some(member => member._id === usr._id) && user?.id as string != usr._id) {
            setSelectedMembers([...selectedMembers, usr])
        }
        setMemberEmail('');
        setSearchedUsers([]);
    }

    const removeMember = (email: string) => {
        setSelectedMembers(selectedMembers.filter(member => member._id !== email));
    };

    const createGroup = () => {
        setErr({ groupName: '', members: '' })

        const res = validateCreateGroup(newGroupName, selectedMembers)
        if (res.status) {
            try {
                const members = [...selectedMembers.map((user) => user._id), user?.id as string]
                GroupServices.createNewGroup(newGroupName, members, user?.id as string)
                toast.success("Your Group Created Successfully")
            } catch (error: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message)
                } else {
                    toast.error("Unexpected Error Occured")
                }
            } finally {
                closeModal()
            }
        } else {
            setErr(res.err)
        }
    }
    const handleaddMembers = async () => {
        if (selectedMembers.length == 0) return toast.error("Please Select atlead 1 member with you !")
        if (!selectedGroup) return toast.error("Please Select Group For Add")
        try {
            const members = [...selectedMembers.map((user) => user._id), user?.id as string]
            GroupServices.addToGroup(selectedGroup, members)
            toast.success("Your Group Created Successfully")
        } catch (error: unknown) {
            if (err instanceof Error) {
                toast.error(err.message)
            } else {
                toast.error("Unexpected Error Occured")
            }
        } finally {
            closeModal()
        }
    }
    const leaveGroup = async(groupId :string ) =>{
        try {
            GroupServices.leftGroup(groupId , user?.id as string)
            toast.success("Leaved Group Successfully")
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
    };

    //   const getRandomColor = () => {
    //     const colors = ['#5E686B', '#30A5BF', '#5B54B8', '#8B0000', '#FFFFFF'];
    //     return colors[Math.floor(Math.random() * colors.length)];
    //   };

    return (
        <div className="flex-1 min-h-screen bg-[#1E1E1E] text-white p-6 ml-1">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">My Groups</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#00D2D9] hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                    Create Group
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups?.map((group) => (
                    <div key={group._id} className="bg-zinc-900 border text-[#00D2D9] rounded-lg overflow-hidden">
                        <div className="bg-[#00D2D9] p-3 text-center">
                            <h2 className="text-xl font-semibold text-white">{group.name}</h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300 text-sm">{group.members.length} Members</span>
                                    <a href="#" className="text-[#00D2D9] text-xs hover:underline">view all</a>
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
                                Admin :  <span className="text-[#00D2D9]">  {group.createdBy?.username} </span> {group.createdBy?._id == user?.id && '(You)'}
                            </div>
                            <div className="text-sm text-gray-300 mb-4">
                                Next Session: {group.nextSessionDate || "Not Assigned"}
                            </div>
                            {group.createdBy?._id == user?.id ? <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-md text-sm transition duration-200"
                                onClick={() => setSelectedGroup(group._id)}
                            >
                                Add Member
                            </button> :  <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md text-sm transition duration-200"
                             onClick={()=>leaveGroup(group._id)}
                            >
                                Leave Group
                            </button>
                            }

                        </div>
                    </div>
                ))}
            </div>


            <BaseModal title='Create New Group' isOpen={isModalOpen} onClose={closeModal}>
                <div className="p-6">
                    {/* <h2 className="text-2xl font-bold mb-6 text-white">Create New Group</h2> */}

                    <div className="mb-4">

                        <Input
                            type="text"
                            name=''
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:text-[#00D2D9]"
                            placeholder="Enter group name"
                        />
                        <span className='text-red-600 ml-1'  > {err?.groupName}</span>
                    </div>

                    <div className="mb-6">
                        <div className="flex mb-2">
                            <Input
                                type="email"
                                name=''
                                value={memberEmail}
                                onChange={handleMemberEmailChange}
                                className="flex-1 p-2 bg-zinc-800 border border-zinc-700 rounded-l-md text-white focus:outline-none focus:text-[#00D2D9]"
                                placeholder="Enter email address"
                            />

                            {/* <button
                                onClick={addMember}
                                className="bg-[#00D2D9] hover:bg-teal-600 text-white px-4 rounded-r-md"
                            >
                                Add
                            </button> */}

                        </div>
                        <span className='text-red-600 ml-1'  > {err?.members}</span>

                        {searchedUsers.length > 0 && (
                            <div className="absolute z-10 mt-1 w-max bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
                                <ul>
                                    {searchedUsers?.map(user => (
                                        <li
                                            key={user?._id}
                                            className="p-2 hover:bg-zinc-700 cursor-pointer flex justify-between items-center"
                                            onClick={() => addMember(user)}
                                        >
                                            <div>
                                                <div className="text-white">{user.username || 'User'}</div>
                                                <div className="text-gray-400 text-sm">{user.email}</div>
                                            </div>
                                            <button className="text-[#00D2D9] text-sm">Add</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {selectedMembers.length > 0 && (
                            <div className="mt-3">
                                <h4 className="text-gray-400 mb-2 text-sm">Selected Members:</h4>
                                <div className="space-y-2">
                                    {selectedMembers.map(member => (
                                        <div key={member._id} className="flex items-center justify-between bg-zinc-800 p-2 rounded-md">
                                            <div className="text-white text-sm overflow-hidden overflow-ellipsis">{member.email}</div>
                                            <button
                                                onClick={() => removeMember(member._id)}
                                                className="text-red-500 hover:text-red-400 ml-2"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={closeModal}
                            className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-4 rounded-md mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={createGroup}
                            className="bg-[#00D2D9] hover:bg-teal-600 text-white py-2 px-4 rounded-md"

                        >
                            Create Group
                        </button>
                    </div>
                </div>
            </BaseModal>
            <BaseModal title='Add Member' isOpen={Boolean(selectedGroup)} onClose={() => setSelectedGroup('')} onSubmit={handleaddMembers} >
                <div className="mb-6">
                    <div className="flex mb-2">
                        <Input
                            type="email"
                            name=''
                            value={memberEmail}
                            onChange={handleMemberEmailChange}
                            className="flex-1 p-2 bg-zinc-800 border border-zinc-700 rounded-l-md text-white focus:outline-none focus:text-[#00D2D9]"
                            placeholder="Enter email address"
                        />

                        {/* <button
                                onClick={addMember}
                                className="bg-[#00D2D9] hover:bg-teal-600 text-white px-4 rounded-r-md"
                            >
                                Add
                            </button> */}

                    </div>
                    <span className='text-red-600 ml-1'  > {err?.members}</span>

                    {searchedUsers.length > 0 && (
                        <div className="absolute z-10 mt-1 w-max bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
                            <ul>
                                {searchedUsers?.map(user => (
                                    <li
                                        key={user?._id}
                                        className="p-2 hover:bg-zinc-700 cursor-pointer flex justify-between items-center"
                                        onClick={() => addMember(user)}
                                    >
                                        <div>
                                            <div className="text-white">{user.username || 'User'}</div>
                                            <div className="text-gray-400 text-sm">{user.email}</div>
                                        </div>
                                        <button className="text-[#00D2D9] text-sm">Add</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {selectedMembers.length > 0 && (
                        <div className="mt-3">
                            <h4 className="text-gray-400 mb-2 text-sm">Selected Members:</h4>
                            <div className="space-y-2">
                                {selectedMembers.map(member => (
                                    <div key={member._id} className="flex items-center justify-between bg-zinc-800 p-2 rounded-md">
                                        <div className="text-white text-sm overflow-hidden overflow-ellipsis">{member.email}</div>
                                        <button
                                           
                                            onClick={() => removeMember(member._id)}
                                            className="text-red-500 hover:text-red-400 ml-2"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </BaseModal>


        </div>
    );
};

export default GroupsPage;