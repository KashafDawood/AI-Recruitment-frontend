import axios from "axios";
import { z } from "zod";

const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
});

type ForgetPasswordResponse =
  | { success: true; message: string; reset_url?: string }
  | { success: false; errors?: Record<string, string[]>; serverError?: string };

export const forgetPassword = async (
  formData: FormData
): Promise<ForgetPasswordResponse> => {
  const email = formData.get("email") as string;

  const result = forgetPasswordSchema.safeParse({ email });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/users/forget-password/`,
      { email },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: "Reset password email sent successfully!",
        reset_url: response.data.reset_url,
      };
    }

    return {
      success: false,
      serverError: "Failed to send reset password email",
    };
  } catch (error) {
    console.error("Error during forget password:", error);
    return {
      success: false,
      serverError: "An unexpected error occurred during reset password",
    };
  }
};
