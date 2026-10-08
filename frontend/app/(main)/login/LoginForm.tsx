"use client";
import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/Input/Input";
import { AuthServices } from "@/services/client/auth.client";
import { validateLoginForm } from "@/validations";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import InPageLoading from "@/components/ui/loading/InPageLoading";
import { useAuth } from "@/context/auth.context";
import { COMMON_MESSAGES } from "@/constants/messages/common.messages";

function LoginForm() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formDataErr, setFormDataErr] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormDataErr({ email: "", password: "" });
    try {
      const result = validateLoginForm(formData);
      if (result.status) {
        await AuthServices.loginService(formData);
        await checkAuth();
        router.push("/");
      } else {
        setFormDataErr(result.err);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(COMMON_MESSAGES.UNEXPECTED_ERROR_OCCURED);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-start">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Address"
          />
          <span className="text-red-600 ml-1"> {formDataErr?.email}</span>
        </div>

        <div className="text-start">
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
          />
          <span className="text-red-600 ml-1"> {formDataErr?.password}</span>
        </div>
        <div className="text-start">
          <Button variant="text-like">
          <Link
            href="/forgot-password"
          >
            Forgotten Password?
          </Link>
          </Button>
        </div>

        {loading ? (
          <InPageLoading />
        ) : (
          <Button type="submit" className="w-full">
            Login
          </Button>
        )}

        <div className="flex items-center justify-between mt-6">
          <Button variant="secondary" onClick={AuthServices.googleAuth}>
            Google
          </Button>
          <Button variant="text-like">
            <Link href="/signup">
              Create a new account
            </Link>
          </Button>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
