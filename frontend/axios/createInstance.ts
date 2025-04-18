import axios from "axios"

const createAxiosInstance = (baseUrl: string) => {
  const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true
  });

  return instance;
};

export const authInstance = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/`)
export const userInstances = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/`)
export const adminInstance = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/`)
export const groupInstance = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/groups/`)
export const sessionInstances = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/`)
export const noteInstances = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notes/`)
export const reportInsances = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/reports/`)
export const codeSnippetInstances = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/code-snippets/`)
export const plansInstances = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/plans/`)
export const paymentInstances = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/`)
export const subscriptionInstances = createAxiosInstance(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriptions/`)
export const pistonInstances = createAxiosInstance(`${process.env.NEXT_PISTON_API}/`)
