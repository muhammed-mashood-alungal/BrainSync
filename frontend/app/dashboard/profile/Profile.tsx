"use client";
import ImageCropModal from "@/Components/CropImage/CropImage";
import Input from "@/Components/Input/Input";
import BaseModal from "@/Components/Modal/Modal";
import { useAuth } from "@/Context/auth.context";
import { UserServices } from "@/services/client/user.client";
import { validateResetPasswords } from "@/validations";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash } from "lucide-react";
import UserInNav from "@/Components/UserInNav/UserInNav";


function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<{
    username: string;
    email: string;
    profilePic: string;
  } | null>(null);
  const [stats, setStats] = useState<{
    totalGroups: number;
    totalTimeSpend: string;
    totalSessionsAttended: number;
  }>();

  // const stats = [
  //     { value: '12', label: 'Total Session' },
  //     { value: '78 hr', label: 'Time Spend' },
  //     { value: '5', label: 'Groups Active' },
  //     { value: '62', label: 'Resources Saved' },
  // ]

  useEffect(() => {
    async function fetchUserData() {
      if (user) {
        const data = await UserServices.getUserData(user.id);
        setUserData(data);
        if (data.profilePicture) {
          setPreview(data.profilePicture?.url);
        }
        setNewUsername(data.username);
      }
    }
    fetchUserData();
    async function fetchStats() {
      if (user) {
        const stats = await UserServices.getUserOverallStats();
        setStats(stats);
      }
    }
    fetchStats();
  }, [user]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameEditOn, setIsNameEdit] = useState(false);
  const [isChangePass, setIsChangePass] = useState(false);
  
  const [newUsername, setNewUsername] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [changePassErr, setChangePassErr] = useState({
    oldPass: "",
    password: "",
    confirmPassword: "",
  });

  const handleImageDelete = async () => {
    try {
      await UserServices.deleteProfilePic(user?.id as string);
      setPreview(null);
      toast.success("Profile Picture Deleted Successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.name);
      }
    }
  };

  const editUsername = async () => {
    try {
      if (newUsername.trim() == "") {
        return toast.error("Plese Provide a Username");
      }
      if (newUsername == userData?.username) {
        return toast.error("Nothing To Update");
      }
      await UserServices.editUsername(user?.id as string, newUsername);

      toast.success("Username Updated Successfully");
      setUserData({ ...userData, username: newUsername } as {
        username: string;
        email: string;
        profilePic: string;
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Unexpected Error Occured");
      }
    } finally {
      setIsNameEdit(false);
    }
  };

  const setProfilePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };
  const handleSaveCroppedImage = async (croppedFile: File) => {
   // setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(croppedFile);
      const formData = new FormData();
      formData.append("image", croppedFile);
      await UserServices.changeProfilePic(formData, user?.id as string);

      toast.success("Profile Picture Changed Successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    //  setIsUploading(false);
    }
  };

  const changePassword = async () => {
    setChangePassErr({ oldPass: "", password: "", confirmPassword: "" });

    if (oldPass.trim() === "") {
      setChangePassErr((prev) => ({
        ...prev,
        oldPass: "Please Enter Your Old Password",
      }));
      return;
    }

    const res = validateResetPasswords(pass, confirmPass);

    if (res.status) {
      try {
        await UserServices.changePassword(user?.id as string, oldPass, pass);
        toast.success("Password Changed Successfully");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setOldPass("");
        setPass("");
        setConfirmPass("");
        setIsChangePass(false);
      }
    } else {
      setChangePassErr((prev) => ({ ...prev, ...res.err }));
    }
  };

 
  return (
    <>
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <UserInNav />
        </div>

        {/* Profile info card */}
        <div className="bg-[#2B2B2B] rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#00D2D9]">
                <label htmlFor="profile-image">
                  <img
                    src={preview ? preview : "/profilePic.png"}
                    alt="Profile"
                    className="w-full h-full object-cover hover:cursor-pointer"
                  />
                </label>
              </div>
              <input
                type="file"
                hidden
                id="profile-image"
                onChange={setProfilePhoto}
              />
              {preview && (
                <label
                  onClick={handleImageDelete}
                  className="absolute bottom-0 right-0 bg-[#00D2D9] text-white rounded-full p-1 hover:cursor-pointer"
                >
                  <Trash size={15} />
                </label>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {userData?.username}
              </h2>
              <p className="text-gray-400">{userData?.email}</p>
            </div>

            <button
              className="bg-[#00D2D9] text-[#1E1E1E] px-4 py-2 rounded-lg font-medium hover:cursor-pointer"
              onClick={() => setIsNameEdit(true)}
            >
              Edit Username
            </button>
            <button
              className="bg-[#00D2D9] text-[#1E1E1E] px-4 py-2 rounded-lg font-medium hover:cursor-pointer"
              onClick={() => setIsChangePass(true)}
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Study Statistics */}
        <div className=" rounded-lg p-6 mb-6">
          {/* <h2 className="text-xl font-bold text-white mb-6">
            Study Statistics
          </h2> */}

          <div className="flex justify-between">
            <div className="text-center bg-[#2B2B2B] w-full p-5 m-1 rounded-2xl">
              <p className="text-white text-4xl font-bold">{stats?.totalGroups}</p>
              <p className="text-2xl font-bold text-[#00D2D9]">Groups</p>
            </div>
            <div className="text-center bg-[#2B2B2B] w-full p-5 m-1 rounded-2xl">
              <p className="text-white text-4xl font-bold ">
                {stats?.totalSessionsAttended}
              </p>
              <p className="text-2xl font-bold text-[#00D2D9]">
                Sessions Attended
              </p>
            </div>
            <div className="text-center bg-[#2B2B2B] w-full p-5 m-1 rounded-2xl">
              <p className="text-white text-4xl font-bold">{stats?.totalTimeSpend}</p>
              <p className="text-2xl font-bold text-[#00D2D9]">
                Time Spent On Sessisons
              </p>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
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
            name=""
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
            name=""
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            placeholder="Enter Your Old"
            className="w-full p-3 bg-[#333333] text-white rounded-md border border-gray-600 focus:border-[#00D2D9] focus:outline-none"
          />
          <span className="text-red-600 ml-1"> {changePassErr?.oldPass}</span>
        </div>
        <div className="mt-2">
          <Input
            type="text"
            name=""
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Enter Your new Password"
            className="w-full p-3 bg-[#333333] text-white rounded-md border border-gray-600 focus:border-[#00D2D9] focus:outline-none"
          />
          <span className="text-red-600 ml-1"> {changePassErr?.password}</span>
        </div>
        <div className="mt-2">
          <Input
            type="text"
            name=""
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Confrim Your Password"
            className="w-full p-3 bg-[#333333] text-white rounded-md border border-gray-600 focus:border-[#00D2D9] focus:outline-none"
          />
          <span className="text-red-600 ml-1">
            {" "}
            {changePassErr?.confirmPassword}
          </span>
        </div>
      </BaseModal>
    </>
  );
}

export default Profile;
