import Input from "@/Components/Input/Input";
import { useAuth } from "@/Context/auth.context";
import { UserServices } from "@/services/client/user.client";
import { IUserType } from "@/types/userTypes";
import React, { useState } from "react";

function AddMember({
  selectedMembers,
  setSelectedMembers,
}: {
  selectedMembers: IUserType[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<IUserType[]>>;
}) {
  const [memberEmail, setMemberEmail] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<IUserType[]>([]);
  const { user } = useAuth();

 

  const handleMemberEmailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMemberEmail(e.target.value);
    const res = await UserServices.searchUser(e.target.value);
    setSearchedUsers(res.users);
  };

  const addMember = (usr: IUserType) => {
    if (
      !selectedMembers.some((member) => member._id === usr._id) &&
      (user?.id as string) != usr._id
    ) {
      setSelectedMembers([...selectedMembers, usr]);
    }
    setMemberEmail("");
    setSearchedUsers([])
    setSearchedUsers([]);
  };

  const removeMember = (email: string) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member._id !== email)
    );
  };



  return (
    <>
      <div className="mb-6">
        <div className="flex mb-2">
          <Input
            type="email"
            name=""
            value={memberEmail}
            onChange={handleMemberEmailChange}
            className="flex-1 p-2 bg-zinc-800 border border-zinc-700 rounded-l-md text-white focus:outline-none focus:text-[#00D2D9]"
            placeholder="Enter email address"
          />
        </div>
        {searchedUsers.length > 0 && (
          <div className="absolute z-10 mt-1 w-max bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
            <ul>
              {searchedUsers?.map((user) => (
                <li
                  key={user?._id}
                  className="p-2 hover:bg-zinc-700 cursor-pointer flex justify-between items-center"
                  onClick={() => addMember(user)}
                >
                  <div>
                    <div className="text-white">{user.username || "User"}</div>
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
              {selectedMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center justify-between bg-zinc-800 p-2 rounded-md"
                >
                  <div className="text-white text-sm overflow-hidden overflow-ellipsis">
                    {member.email}
                  </div>
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
    </>
  );
}

export default AddMember;
