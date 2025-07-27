"use client";
import InPageLoading from "@/components/ui/loading/InPageLoading";
import Input from "@/components/ui/Input/Input";
import BaseModal from "@/components/ui/modal/BaseModal";
import { LogIn, Plus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SESSION_MESSAGES } from "@/constants/message.constants/session.messages";

function QuickActions() {
  const router = useRouter();
  const [sessionJoinOpen, setSessionJoinOpen] = useState(false);
  const [sessionCode, setSessionCode] = useState("");
  const [sessionCodeErr, setSessionCodeErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinSession = () => {
    setSessionCodeErr("");
    if (sessionCode.trim() == "") {
      setSessionCodeErr(SESSION_MESSAGES.ENTER_SESSION_CODE);
      setLoading(false);
      return;
    }
    setLoading(true);
    router.push(`/sessions/${sessionCode}`);
    setLoading(false);
  };
  return (
    <>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={"/dashboard/sessions#create"}>
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg p-4 flex items-center cursor-pointer hover:shadow-lg transition">
              <div className="bg-cyan-400 bg-opacity-30 rounded-full p-2 mr-4">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Create Session</h3>
                <p className="text-sm text-cyan-100">Start a new study room</p>
              </div>
            </div>
          </Link>

          {/* Join Session Card */}
          <div
            className="bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg p-4 flex items-center cursor-pointer hover:shadow-lg transition"
            onClick={() => setSessionJoinOpen(true)}
          >
            <div className="bg-cyan-400 bg-opacity-30 rounded-full p-2 mr-4">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Join Session</h3>
              <p className="text-sm text-cyan-100">Enter with code/link</p>
            </div>
          </div>

          <Link href={"/dashboard/groups#create"}>
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-lg p-4 flex items-center cursor-pointer hover:shadow-lg transition">
              <div className="bg-cyan-400 bg-opacity-30 rounded-full p-2 mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Create Group</h3>
                <p className="text-sm text-cyan-100">
                  Create your group for easy sharing
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
      <BaseModal
        isOpen={sessionJoinOpen}
        onClose={() => setSessionJoinOpen(false)}
        title="Enter Session Code"
      >
        <div className="">
          <Input
            name="sessionCode"
            onChange={(e) => setSessionCode(e.target.value)}
            type="text"
            placeholder="Enter Session Code"
            value={sessionCode}
            className="w-3/4"
          />
          <span className="text-red-600 ml-1"> {sessionCodeErr}</span>
          <div className="flex w-full justify-center m-2">
            {loading ? (
              <InPageLoading />
            ) : (
              <button
                className="w-2/4 py-3 px-6 bg-cyan-500 hover:bg-cyan-600 
                 text-white font-medium rounded-full focus:outline-none focus:ring-2
                  focus:ring-cyan-500 transition duration-150 hover:cursor-pointer"
                onClick={handleJoinSession}
              >
                Join
              </button>
            )}
          </div>
        </div>
      </BaseModal>
    </>
  );
}

export default QuickActions;
