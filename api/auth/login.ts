import { z } from "zod";
import { createSession } from "@/app/_lib/session";
import { getme } from "./getme";
import axiosInstance from "../axiosConfig";
import axios from "axios";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be 8 characters long!" }),
});

export const login = async (_: unknown, formData: FormData) => {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Using axiosInstance instead of axios directly
    const response = await axiosInstance.post(`/api/users/login/`, result.data);

    if (response.status === 200) {
      const user = response.data.user;
      await createSession(user.id, user.role);
      await getme();
      return {
        message: "Login successful",
        user: response.data.user,
      };
    }
  } catch (error) {
    // Error handling for axiosInstance errors
    if (axios.isAxiosError(error) && error.response) {
      if (
        error.response.data?.error ===
        "Please verify your email before logging in."
      ) {
        return {
          serverError: "Please verify your email before logging in.",
          verifyEmail: true,
        };
      }
      return {
        serverError:
          error.response.data?.non_field_errors?.[0] ||
          "An error occurred during login",
      };
    }
    return {
      serverError: "An unexpected error occurred during login",
    };
  }
};
