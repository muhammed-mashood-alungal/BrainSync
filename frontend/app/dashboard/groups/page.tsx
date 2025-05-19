"use client";
import React, { useEffect, useState } from "react";
import BaseModal from "@/Components/Modal/Modal";
import { GroupServices } from "@/services/client/group.client";
import { useAuth } from "@/Context/auth.context";
import { toast } from 'react-hot-toast';
import { IUserType } from "@/types/userTypes";
import { IGroupType } from "@/types/groupTypes";
import GroupDetails from "@/app/dashboard/groups/GroupDetails";
import { Calendar, LogOutIcon, Trash, UserPlus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Confirm from "@/Components/ConfirmModal/ConfirmModal";
import CreateGroup from "./CreateGroup";
import AddMember from "./AddMember";

const GroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<IGroupType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, checkAuth } = useAuth();
  const [selectedMembers, setSelectedMembers] = useState<IUserType[]>([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [viewGroup, setViewGroup] = useState<IGroupType>();
  const [leavingGroupId, setLeavingGroupId] = useState("");
  const [deletingGroup, setDeletingGroupId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash == "#create") {
      setIsModalOpen(true);
    }
  }, []);

  useEffect(() => {
    async function fetchGroups() {
      const groups = await GroupServices.getMyGroups(user?.id as string);
      setGroups(groups as []);
    }
    fetchGroups();
  }, [user]);

  const deleteGroup = async () => {
    if (!deletingGroup) return;

    try {
      await GroupServices.deleteGroup(deletingGroup);
      setGroups((grps) => {
        return grps.filter((g) => g._id != deletingGroup);
      });
      setDeletingGroupId("");
    } catch (error) {
      console.log(error);
      toast.error(
        "Something Went Wrong While Deleting Group. Please Try Again Later"
      );
    }
  };

  const handleaddMembers = async () => {
    if (selectedMembers.length == 0)
      return toast.error("Please Select atlead 1 member with you !");
    if (!selectedGroup) return toast.error("Please Select Group For Add");
    try {
      const members = [
        ...selectedMembers.map((user) => user._id),
        user?.id as string,
      ];
      GroupServices.addToGroup(selectedGroup, members);
      toast.success("Added Member Successfully");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unexpected Error Occured");
      }
    } finally {
      setSelectedGroup("");
      checkAuth();
    }
  };
  const leaveGroup = async () => {
    try {
      GroupServices.leftGroup(leavingGroupId, user?.id as string);
      toast.success("Leaved Group Successfully");
      checkAuth();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Unexpected Error Occured");
      }
    } finally {
      closeModal();
      setLeavingGroupId("");
    }
  };

  const updateGroupName =async( groupId :string , newName :string )=>{
    try {
      await GroupServices.editGroupName(groupId ,user?.id as string ,  newName)
      setGroups((grps)=>{
        return grps.map((g)=>{
          return g._id == groupId ? {...g , name : newName} : g
        })
      })
      toast.success("Group Named Updated")
    } catch (error) {
      console.log(error)
    }
  }

  const removeMember = async(groupId : string , memberId : string) =>{
    try {
      await GroupServices.removeMemberfromGroup(groupId , user?.id as string , memberId)
      setGroups((grps)=>{
        return grps.map((g)=>{
          return g._id == groupId ? {...g , members : g.members.filter((m)=>m._id != memberId) } : g
        })
      })
      toast.success("Removed User Successfully")
    } catch (error) {
      console.log(error)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMembers([]);
  };

  return (
    <div className="flex-1 min-h-screen bg-[#1E1E1E] text-white p-6 ml-1">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Groups</h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            router.push("/dashboard/groups#create");
          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          <span>Create Group</span>
          <UserPlus size={18} />
        </button>
      </div>
      <div className="px-4 py-6">
        {/* Header with Create Group Button */}

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-cyan-500/40 rounded-xl">
              <Users size={48} className="text-cyan-500/70 mb-4" />
              <h3 className="text-xl font-medium text-gray-300">
                No Groups Found
              </h3>
              <p className="text-gray-400 mt-2 text-center">
                Create a new group to get started or join an existing one.
              </p>
            </div>
          ) : (
            groups?.map((group) => (
              <div
                key={group._id}
                className="bg-zinc-900/70 border border-cyan-500/30 hover:border-cyan-500/70 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 hover:translate-y-[-2px]"
              >
                {/* Group Header */}
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-400 px-4 py-3 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white truncate">
                    {group.name}
                  </h2>
                  <div className="flex gap-1">
                    {group.createdBy?._id === user?.id ? (
                      <>
                        <button
                          className="text-white p-1.5 rounded-md hover:bg-white/20 transition-colors"
                          onClick={() => setSelectedGroup(group._id)}
                          title="Add Members"
                        >
                          <UserPlus size={18} />
                        </button>
                        <button
                          className="text-white p-1.5 rounded-md hover:bg-white/20 transition-colors"
                          onClick={() => setDeletingGroupId(group._id)}
                          title="Delete Group"
                        >
                          <Trash size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-white p-1.5 rounded-md hover:bg-white/20 transition-colors"
                        onClick={() => setLeavingGroupId(group._id)}
                        title="Leave Group"
                      >
                        <LogOutIcon
                          size={18}
                          style={{ transform: "scaleX(-1)" }}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {/* Group Content */}
                <div className="p-5">
                  {/* Members Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-cyan-400" />
                        <span className="text-gray-300 font-medium">
                          {group.members.length}{" "}
                          {group.members.length === 1 ? "Member" : "Members"}
                        </span>
                      </div>
                      <button
                        onClick={() => setViewGroup(group)}
                        className="text-cyan-400 text-sm hover:text-cyan-300 hover:underline transition-colors"
                      >
                        view all
                      </button>
                    </div>

                    {/* Member Avatars */}
                    <div className="flex items-center">
                      {group.members.slice(0, 4).map((member) => (
                        <div
                          key={member._id}
                          className="w-10 h-10 -ml-1 first:ml-0 border-2 border-zinc-900 rounded-full overflow-hidden"
                        >
                          <img
                            src={member?.profilePicture || "/profilePic.png"}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ))}
                      {group.members.length > 4 && (
                        <div className="w-10 h-10 -ml-1 bg-zinc-800 border-2 border-zinc-900 rounded-full flex items-center justify-center text-xs font-medium text-cyan-300">
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Group Info */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="min-w-20 text-gray-400">Admin</span>
                      <span className="text-cyan-400 font-medium">
                        {group.createdBy?.username}
                        {group.createdBy?._id === user?.id && " (You)"}
                      </span>
                    </div>
                    {/* <div className="flex items-center text-sm text-gray-300">
                      <span className="min-w-20 text-gray-400">
                        Next Session
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        Not Assigned
                      </span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <BaseModal
        title="Create New Group"
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <CreateGroup setGroups={setGroups} closeModal={closeModal} />
      </BaseModal>

      <BaseModal
        title="Add Member"
        isOpen={Boolean(selectedGroup)}
        onClose={() => setSelectedGroup("")}
        onSubmit={handleaddMembers}
      >
        <AddMember
          setSelectedMembers={setSelectedMembers}
          selectedMembers={selectedMembers}
        />
      </BaseModal>

      <BaseModal
        isOpen={Boolean(viewGroup?._id)}
        onClose={() => setViewGroup(undefined)}
        title="Group Details"
        size="4xl"
      >
        <GroupDetails
          currentUserId={user?.id as string}
          groupData={viewGroup}
          onRemoveMember={removeMember}
          onUpdateGroupName={updateGroupName}
        />
      </BaseModal>

      <Confirm
        isOpen={Boolean(leavingGroupId)}
        onClose={() => setLeavingGroupId("")}
        onConfirm={leaveGroup}
      />
      <Confirm
        isOpen={Boolean(deletingGroup)}
        onClose={() => setDeletingGroupId("")}
        onConfirm={deleteGroup}
      />
    </div>
  );
};

export default GroupsPage;
