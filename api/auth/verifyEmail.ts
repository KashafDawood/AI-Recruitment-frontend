import axiosInstance from "../axiosConfig";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

export const verifyEmail = async (user: User, otp: string) => {
  try {
    const response = await axiosInstance.post("/api/users/verify-email/", {
      user,
      otp,
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};
