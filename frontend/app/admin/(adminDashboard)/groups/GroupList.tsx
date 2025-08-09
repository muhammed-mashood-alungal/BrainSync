"use client";
import React, { useCallback, useState } from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import { GroupServices } from "@/services/client/group.client";
import { useAuth } from "@/context/auth.context";
import { toast } from "react-hot-toast";
import { IGroupType } from "@/types/groupTypes";
import Confirm from "@/components/ui/modal/ConfirmModal";
import GroupDetails from "../../../dashboard/groups/GroupDetails";
import { Calendar, Power, Users } from "lucide-react";
import { GROUP_MESSAGES } from "@/constants/messages/group.messages";
import { COMMON_MESSAGES } from "@/constants/messages/common.messages";

function GroupList({ inititalGroups }: { inititalGroups: IGroupType[] }) {
  const [groups, setGroups] = useState<IGroupType[]>(inititalGroups);
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState("");
  const [viewGroup, setViewGroup] = useState<IGroupType>();

  const handleActivation = async () => {
    try {
      const groupId = selectedGroup;
      await GroupServices.deactivate(groupId);
      toast.success(GROUP_MESSAGES.GROUP_STATUS_UPDATED);
      setGroups((grps) => {
        return grps?.map((group) => {
          return group._id == groupId
            ? { ...group, isActive: !group.isActive }
            : group;
        });
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(COMMON_MESSAGES.UNEXPECTED_ERROR_OCCURED);
      }
    } finally {
      setSelectedGroup("");
    }
  };

  const handleCloseConfirm = useCallback(() => setSelectedGroup(""), []);
  const handleConfirm = useCallback(
    () => handleActivation(),
    [handleActivation]
  );

  const handleCloseModal = useCallback(() => setViewGroup(undefined), []);

  return (
    <>
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-12 border border-dashed border-[#8979FF]/40 rounded-xl">
              <Users size={48} className="text-[#8979FF]/70 mb-4" />
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
                className="bg-zinc-900/70 border border-[#8979FF]/30 hover:border-[#8979FF]/70 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[#8979FF]/10 hover:translate-y-[-2px]"
              >
                <div className="bg-gradient-to-r from-[#8979FF] to-[#A194FF] px-4 py-3">
                  <h2 className="text-xl font-semibold text-white text-center truncate">
                    {group.name}
                  </h2>
                </div>

                <div className="p-5">
                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-[#8979FF]" />
                        <span className="text-gray-300 font-medium">
                          {group.members.length}{" "}
                          {group.members.length === 1 ? "Member" : "Members"}
                        </span>
                      </div>
                      <button
                        onClick={() => setViewGroup(group)}
                        className="text-[#8979FF] text-sm hover:text-[#A194FF] hover:underline transition-colors hover:cursor-pointer"
                      >
                        view all
                      </button>
                    </div>

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
                        <div className="w-10 h-10 -ml-1 bg-zinc-800 border-2 border-zinc-900 rounded-full flex items-center justify-center text-xs font-medium text-[#8979FF]">
                          +{group.members.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-zinc-800 mb-5">
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="min-w-20 text-gray-400">Admin</span>
                      <span className="text-[#8979FF] font-medium">
                        {group.createdBy?.username}
                        {group.createdBy?._id === user?.id && " (You)"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <span className="min-w-20 text-gray-400">
                        Next Session
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        Not Assigned
                      </span>
                    </div>
                  </div>

                  <button
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:cursor-pointer ${
                      group.isActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => setSelectedGroup(group._id)}
                  >
                    <Power size={16} />
                    <span>{group.isActive ? "Deactivate" : "Activate"}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Confirm
        isOpen={Boolean(selectedGroup)}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirm}
      ></Confirm>
      <BaseModal
        isOpen={Boolean(viewGroup?._id)}
        onClose={handleCloseModal}
        title={viewGroup?.name as string}
        size="4xl"
      >
        <GroupDetails
          currentUserId={user?.id as string}
          groupData={viewGroup}
          onRemoveMember={() => console.log("removing")}
        />
      </BaseModal>
    </>
  );
}

export default GroupList;
