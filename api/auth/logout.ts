import { deleteSession } from "@/app/_lib/session";
import axios from "axios";

export const logout = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/users/logout/`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      deleteSession();
    }
  } catch (error) {
    throw error;
  }
};
