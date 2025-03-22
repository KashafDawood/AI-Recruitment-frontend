import { User } from "@/store/userStore";
import axiosInstance from "../axiosConfig";

export const getUserByUsername = async (username: string): Promise<User> => {
  const response = await axiosInstance.get(`/api/users/${username}/`);
  return response.data;
};
