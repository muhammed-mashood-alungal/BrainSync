import { IGroupType } from '@/types/groupTypes';
import React from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture: string;
}

interface GroupDetailsProps {
  group:IGroupType | undefined
  currentUserId: string;
  onRemoveMember: (memberId: string) => void;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ 
  group, 
  currentUserId, 
  onRemoveMember 
}) => {
  return (
    <>
      <div className="mb-6">
        <h3 className="text-gray-400 text-sm mb-1">Group Name</h3>
        <p className="text-white text-lg font-medium">{group?.name}</p>
      </div>
      
     
      <div className="mb-6 flex items-center">
        <h3 className="text-gray-400 text-sm mr-2">Status:</h3>
        <span className={`px-2 py-1 text-xs rounded-full ${
          group?.isActive 
            ? "bg-green-900/50 text-green-400" 
            : "bg-red-900/50 text-red-400"
        }`}>
          {group?.isActive ? "Active" : "Inactive"}
        </span>
      </div>
      
      {/* Created By */}
      <div className="mb-6">
        <h3 className="text-gray-400 text-sm mb-3">Created By</h3>
        <div className="flex items-center px-4 py-3 bg-[#252527] rounded-md">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
            <img 
              src={group?.createdBy?.profilePicture?.url  || 'ProfilePic.png'} 
              alt={group?.createdBy?.username} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="text-white font-medium">{group?.createdBy?.username}</p>
            <p className="text-gray-400 text-sm">{group?.createdBy?.email}</p>
          </div>
        </div>
      </div>
      
      {/* Members List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-gray-400 text-sm">Members ({group?.members?.length})</h3>
        </div>
        
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {group?.members?.map(member => (
            <div 
              key={member._id} 
              className="flex items-center justify-between px-4 py-3 bg-[#252527] rounded-md"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                  <img 
                    src={member?.profilePicture?.url || '/ProfilePic.png'} 
                    alt={member?.username} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">{member.username}</p>
                  <p className="text-gray-400 text-sm">{member.email}</p>
                </div>
              </div>
              
              {/* {member._id !== currentUserId && (
                <button 
                  onClick={() => onRemoveMember(member._id)}
                  className="text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/40 px-3 py-1 text-sm rounded-md transition-colors"
                >
                  Remove
                </button>
              )} */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GroupDetails;