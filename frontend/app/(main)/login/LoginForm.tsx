"use client";
import Button from "@/Components/Button/Button";
import Input from "@/Components/Input/Input";
import { AuthServices } from "@/services/client/auth.client";
import { validateLoginForm } from "@/validations";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';
import { useAuth } from "@/Context/auth.context";
import InPageLoading from "@/Components/InPageLoading/InPageLoading";

function LoginForm() {
  const { user ,checkAuth} = useAuth();
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
        // Poll for the accessToken cookie
        await checkAuth()
        router.push('/')
      } else {
        setFormDataErr(result.err);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
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
          <Link
            href="/forgot-password"
            className="text-cyan-400 hover:text-cyan-300   mb-4"
          >
            Forgotten Password?
          </Link>
        </div>

        {loading ? (
          <InPageLoading />
        ) : (
          <Button
            type="submit"
            className="w-full py-3  bg-cyan-400 hover:bg-cyan-500 text-black font-medium rounded-md transition duration-300"
          >
            Login
          </Button>
        )}

        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={AuthServices.googleAuth}
            className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded-full hover:bg-gray-800"
          >
            Google
          </button>
          <Link href="/signup" className="text-cyan-400 hover:text-cyan-300">
            Create a new account
          </Link>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
