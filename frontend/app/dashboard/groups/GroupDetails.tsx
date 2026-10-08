import { useAuth } from "@/context/auth.context";
import { IGroupType } from "@/types/groupTypes";
import { CheckCircle, Edit2, Save, User, Users, X } from "lucide-react";
import React, { useState } from "react";

interface GroupDetailsProps {
  groupData: IGroupType | undefined;
  currentUserId: string;
  onRemoveMember: (groupId: string, memberId: string) => void;
  onUpdateGroupName?: (groupId: string, newName: string) => void;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({
  groupData,
  onRemoveMember,
  onUpdateGroupName,
}) => {
  const [group, setGroup] = useState<IGroupType | undefined>(groupData);
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState(group?.name || "");

  const handleSaveGroupName = () => {
    if (newGroupName.trim() && onUpdateGroupName) {
      onUpdateGroupName(group?._id as string, newGroupName);
      setIsEditing(false);
      setGroup((grp: any) => {
        return { ...grp, name: newGroupName };
      });
    }
  };
  const handleRemoveMember = (memberId: string) => {
    onRemoveMember(group?._id as string, memberId);
    setGroup((grp: any) => {
      return {
        ...grp,
        members: grp.members.filter((m: IGroupType) => m._id != memberId),
      };
    });
  };

  const isGroupOwner = group?.createdBy._id === user?.id;

  return (
    <div className="text-white">
      {/* Group Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
        <div className="flex-1">
          {!isEditing ? (
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-white">
                {group?.name}
              </h2>
              {isGroupOwner && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-2 p-1 text-gray-400 hover:text-white transition-colors"
                  title="Edit group name"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-blue-500 focus:outline-none w-full"
                placeholder="Enter group name"
                autoFocus
              />
              <button
                onClick={handleSaveGroupName}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors hover:cursor-pointer"
                title="Save"
              >
                <Save size={16} />
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewGroupName(group?.name || "");
                }}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors hover:cursor-pointer"
                title="Cancel"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <span
            className={`px-3 py-1 text-xs rounded-full flex items-center ${
              group?.isActive
                ? "bg-green-900/50 text-green-400 border border-green-700"
                : "bg-red-900/50 text-red-400 border border-red-700"
            }`}
          >
            {group?.isActive ? (
              <>
                <CheckCircle size={12} className="mr-1" />
                Active
              </>
            ) : (
              <>
                <X size={12} className="mr-1" />
                Inactive
              </>
            )}
          </span>
        </div>
      </div>

      {/* Group Info and Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Group Info */}
        <div>
          {/* Created By */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm mb-3 flex items-center">
              <User size={16} className="mr-2" /> Created By
            </h3>
            <div className="flex items-center px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                <img
                  src={group?.createdBy?.profilePicture || "/ProfilePic.png"}
                  alt={group?.createdBy?.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">
                  {group?.createdBy?.username}
                  {group?.createdBy?._id === user?.id && (
                    <span className="ml-2 text-xs text-blue-400">(You)</span>
                  )}
                </p>
                <p className="text-gray-400 text-sm">
                  {group?.createdBy?.email}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-gray-400 text-sm mb-3">Group Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 text-center">
                <p className="text-2xl font-semibold text-white">
                  {group?.members?.length || 0}
                </p>
                <p className="text-gray-400 text-sm">Members</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 text-center">
                <p className="text-2xl font-semibold text-white">
                  {new Date(
                    group?.createdAt || Date.now()
                  ).toLocaleDateString()}
                </p>
                <p className="text-gray-400 text-sm">Created On</p>
              </div>
            </div>
          </div>
        </div>

        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-gray-400 text-sm flex items-center">
              <Users size={16} className="mr-2" /> Members (
              {group?.members?.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto h-[300px] pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {group?.members?.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                    <img
                      src={member?.profilePicture || "/profilePic.png"}
                      alt={member?.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">
                      {member.username}
                      {member._id === user?.id && (
                        <span className="ml-2 text-xs text-blue-400">
                          (You)
                        </span>
                      )}
                    </p>
                    <p className="text-gray-400 text-sm">{member.email}</p>
                  </div>
                </div>
                {isGroupOwner && member._id !== user?.id && (
                  <div className="relative group">
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/40 p-2 rounded-md transition-colors hover:cursor-pointer"
                      title="Remove member"
                    >
                      <X size={18} />
                    </button>
                    <div className="absolute z-50 bottom-full mb-1 right-0 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-700">
                      Remove member
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetails;
