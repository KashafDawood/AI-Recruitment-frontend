import axios from "axios";
import type { User } from "./verifyEmail";

export const resendEmail = async (user: User) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/users/resend-otp-email/`,
      JSON.stringify({ user }),
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      throw new Error(errorData?.message || "Failed to resend email");
    }
    throw new Error("An unexpected error occurred while resending email");
  }
};