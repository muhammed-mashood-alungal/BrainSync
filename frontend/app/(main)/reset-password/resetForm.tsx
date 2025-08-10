"use client";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/Input/Input";
import { AuthServices } from "@/services/client/auth.client";
import { validateResetPasswords } from "@/validations";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth.context";
import { COMMON_MESSAGES } from "@/constants/messages/common.messages";

function ResetForm() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [password, setPassword] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [confirmPassErr, setConfirmPassErr] = useState("");

  const searchParams = useSearchParams();
  const token = searchParams?.get("token");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const result = validateResetPasswords(password, confirmPass);
      if (result.status) {
        await AuthServices.resetPassword(token as string, password);
        router.push("/login");
      } else {
        if (result.err?.password) setPasswordErr(result.err.password);
        if (result.err?.confirmPassword)
          setConfirmPassErr(result.err.confirmPassword);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(COMMON_MESSAGES.UNEXPECTED_ERROR_OCCURED);
      }
    }
  };

  return (
    <>
      <div className=" text-center">
        <h1 className="text-4xl font-bold mb-4">Reset Password</h1>
        <p className="text-gray-400 mb-6 ">Enter Your New Password Here</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-start">
            <Input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
            />
            <span className="text-red-600 ml-1"> {passwordErr}</span>
          </div>
          <div className="text-start">
            <Input
              type="password"
              name="confirmPass"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Confirm Password"
            />
            <span className="text-red-600 ml-1"> {confirmPassErr}</span>
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>

        <div className="flex items-center justify-between mt-6">
          <div className="text-start">
            <Button variant="secondary">
              <Link href="" onClick={() => router.back()}>
                Back
              </Link>
            </Button>
          </div>
          <Button>
            <Link href="/signup">Create a new account</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

export default ResetForm;
