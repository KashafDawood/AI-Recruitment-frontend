import axios from "axios";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

export const verifyEmail = async (user: User, otp: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/users/verify-email/`,
      { user, otp },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};
