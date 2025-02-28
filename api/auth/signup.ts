import axios from "axios";
import { z } from "zod";
import { saveUserToLocalStorage } from "@/utils/localStorage";
import axiosInstance from "../axiosConfig";

const signupSchema = z.object({
  name: z.string().max(20, { message: "Name must be 20 characters or less!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be 8 characters long!" }),
  role: z.string().max(10),
});

export const signup = async (_: unknown, formData: FormData) => {
  const result = signupSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await axiosInstance.post(
      "/api/users/signup/",
      result.data
    );

    if (response.status === 201) {
      const user = { ...response.data.user, verifyEmail: true };
      saveUserToLocalStorage(user);
      return {
        message: "signup successful! Please verify your email",
        user,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      if (
        errorData.email &&
        errorData.email.includes("user with this email already exists.")
      ) {
        return {
          serverError: "User with this email already exists.",
        };
      }
      return {
        serverError:
          errorData?.non_field_errors?.[0] || "An error occurred during signup",
      };
    }
    return {
      serverError: "An unexpected error occurred during signup",
    };
  }
};
