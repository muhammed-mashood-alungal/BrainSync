import Input from "@/components/ui/Input/Input";
import { useAuth } from "@/context/auth.context";
import { GroupServices } from "@/services/client/group.client";
import { UserServices } from "@/services/client/user.client";
import { IUserType } from "@/types/userTypes";
import { validateCreateGroup } from "@/validations";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { COMMON_MESSAGES } from "@/constants/message.constants/common.messages";
import { GROUP_MESSAGES } from "@/constants/message.constants/group.messages";

function CreateGroup({
  setGroups,
  closeModal,
}: {
  setGroups: any;
  closeModal: () => void;
}) {
  const [newGroupName, setNewGroupName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<IUserType[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<IUserType[]>([]);
  const { user, checkAuth } = useAuth();
  const router = useRouter();

  const [err, setErr] = useState({
    groupName: "",
    members: "",
  });

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
    setSearchedUsers([]);
  };

  const removeMember = (email: string) => {
    setSelectedMembers(
      selectedMembers.filter((member) => member._id !== email)
    );
  };

  const createGroup = async () => {
    setErr({ groupName: "", members: "" });

    const res = validateCreateGroup(newGroupName, selectedMembers);
    if (res.status) {
      try {
        const members = [
          ...selectedMembers.map((user) => user._id),
          user?.id as string,
        ];
        const newGroup = await GroupServices.createNewGroup(
          newGroupName,
          members,
          user?.id as string
        );
        setGroups((prevGroups: any) => {
          return [newGroup, ...prevGroups];
        });
        toast.success(GROUP_MESSAGES.GROUP_CREATED);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error(COMMON_MESSAGES.UNEXPECTED_ERROR_OCCURED);
        }
      } finally {
        checkAuth();
        closeModal();
        setNewGroupName("");
        router.replace("/dashboard/groups");
      }
    } else {
      setErr(res.err);
    }
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-4">
          <Input
            type="text"
            name=""
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:text-[#00D2D9]"
            placeholder="Enter group name"
          />
          <span className="text-red-600 ml-1"> {err?.groupName}</span>
        </div>

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
          <span className="text-red-600 ml-1"> {err?.members}</span>

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
                      <div className="text-white">
                        {user.username || "User"}
                      </div>
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
    </>
  );
}

export default CreateGroup;
