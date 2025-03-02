import axios from "axios";
import { z } from "zod";
import axiosInstance from "../axiosConfig";

const resetPasswordSchema = z.object({
  new_password: z
    .string()
    .min(8, { message: "Password must be 8 characters long!" }),
});

export const resetPassword = async (token: string, newPassword: string) => {
  const result = resetPasswordSchema.safeParse({ new_password: newPassword });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/users/resetpassword/${token}`,
      { new_password: newPassword },
    );

    if (response.status === 200) {
      return {
        success: true,
        message: "Password reset successfully!",
      };
    }

    return {
      success: false,
      serverError: "Failed to reset password",
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      return {
        serverError: errorData?.message || "An error occurred during reset password",
      };
    }
    return {
      serverError: "An unexpected error occurred during reset password",
    };
  }
};

