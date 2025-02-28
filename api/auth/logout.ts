import { deleteSession } from "@/app/_lib/session";
import axiosInstance from "../axiosConfig";

export const logout = async () => {
  try {
    const response = await axiosInstance.post("/api/users/logout/");
    if (response.status === 200) {
      deleteSession();
    }
  } catch (error) {
    throw error;
  }
};
