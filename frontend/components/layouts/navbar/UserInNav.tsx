"use client";
import { useAuth } from "@/context/auth.context";
import { AuthServices } from "@/services/client/auth.client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

function UserInNav() {
  const { checkAuth, user } = useAuth();
  const router = useRouter();
  const logout = async () => {
    try {
      await AuthServices.logout();
      checkAuth();
      router.push("/login");
    } catch (err) {
      console.log(err);
      toast.error("Logout Failed");
    }
  };
  return (
    <div>
      <div>
        <div className="flex items-center gap-4">
          <button onClick={logout} className="text-[#00D2D9] hover:underline">
            Logout
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={
                user?.profilePicture ? user.profilePicture : "/profilePic.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInNav;
