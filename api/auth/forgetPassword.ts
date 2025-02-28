import axios from "axios";
import { z } from "zod";

const forgetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
});

export const forgetPassword = async (formData: Record<string, any>) => {
  console.log("Received formData:", formData); // Debugging log

  if (!formData || !formData.email) {
    console.error("Invalid formData:", formData);
    return { serverError: "Form data is missing or incorrect" };
  }

  const email = formData.email;
  console.log("Extracted email:", email); // Debugging log

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
        message: "Reset password email sent successfully!",
        reset_url: response.data.reset_url,
      };
    }
  } catch (error) {
    console.error("Error during forget password:", error);
    return { serverError: "An unexpected error occurred during reset password" };
  }
};
