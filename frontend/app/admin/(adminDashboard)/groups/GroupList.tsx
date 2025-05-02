'use client'
import React, {  useState } from 'react';
import BaseModal from '@/Components/Modal/Modal'
import { GroupServices } from '@/services/client/group.client';
import { useAuth } from '@/Context/auth.context';
import { toast } from 'react-toastify';
import { IGroupType } from '@/types/groupTypes';
import Confirm from '@/Components/ConfirmModal/ConfirmModal';
import GroupDetails from '../../../../Components/GroupDetails/GroupDetails';
import EmptyList from '@/Components/EmptyList/EmptyList';


function GroupList({inititalGroups } :{inititalGroups :IGroupType[]}) {
    const [groups, setGroups] = useState<IGroupType[]>(inititalGroups);
    const { user } = useAuth()
    const [selectedGroup, setSelectedGroup] = useState('')
    const [viewGroup, setViewGroup] = useState<IGroupType>()

    // const [err, setErr] = useState({
    //     groupName: '',
    //     members: ''
    // })


    const handleActivation = async () => {
        try {
            const groupId = selectedGroup
            await GroupServices.deactivate(groupId)
            toast.success("Updated Group Status")
            setGroups((grps) => {
                return grps?.map(group => {
                    return group._id == groupId ? { ...group, isActive: !group.isActive } : group
                })
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message)
            } else {
                toast.error("Unexpected Error Occured")
            }
        } finally {
            setSelectedGroup('')
          //  closeModal()
        }
    }
    // const closeModal = () => {
    //     setIsModalOpen(false);
    //     setNewGroupName('');
    //     setMemberEmail('');
    //     setSelectedMembers([]);
    // }


    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups?.length == 0 && <EmptyList />}
                {groups?.map((group) => (
                    <div key={group._id} className="bg-zinc-900 border text-[#8979FF] rounded-lg overflow-hidden">
                        <div className="bg-[#8979FF] p-3 text-center">
                            <h2 className="text-xl font-semibold text-white">{group.name}</h2>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-300 text-sm">{group.members.length} Members</span>
                                    <a onClick={() => setViewGroup(group)} className="text-[#8979FF] text-xs hover:cursor-pointer">view all</a>
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
                                onClick={() => setSelectedGroup(group._id)}
                            >
                                Deactivate
                            </button> : <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded-md text-sm transition duration-200"
                                onClick={() => setSelectedGroup(group._id)}
                            >
                                Activate
                            </button>
                            }

                        </div>
                    </div>
                ))}
            </div>
            <Confirm isOpen={Boolean(selectedGroup)} onClose={() => setSelectedGroup('')}
                onConfirm={() => handleActivation()}
            >
            </Confirm>
            <BaseModal isOpen={Boolean(viewGroup?._id)} onClose={() => setViewGroup(undefined)} title={viewGroup?.name as string} >
                <GroupDetails currentUserId={user?.id as string} group={viewGroup} onRemoveMember={() => console.log('removing')} />
            </BaseModal>
        </>
    )
}

export default GroupList