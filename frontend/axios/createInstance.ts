import axios from "axios"

const createAxiosInstance = (baseUrl: string) => {
  const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true
  });

  return instance;
};

export const authInstance = createAxiosInstance("http://localhost:5000/api/auth/");
export const userInstances = createAxiosInstance("http://localhost:5000/api/users/");
export const adminInstance = createAxiosInstance("http://localhost:5000/api/admin/");
export const groupInstance = createAxiosInstance("http://localhost:5000/api/groups/");