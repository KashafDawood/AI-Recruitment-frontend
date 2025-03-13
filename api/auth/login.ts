import { z } from "zod";
import { createSession } from "@/app/_lib/session";
import { getme } from "./getme";
import axiosInstance from "../axiosConfig";
import axios from "axios";
import { User } from "@/types/user";

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
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/users/login/`,
      result.data
    );

    if (response.status === 200) {
      const user: User = response.data.user;
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
      // Handle email verification error
      if (
        error.response.data?.error ===
        "Please verify your email before logging in."
      ) {
        return {
          serverError: "Please verify your email before logging in.",
          verifyEmail: true,
          user: error.response.data.user,
        };
      }

      // Handle non_field_errors (like "Invalid credentials")
      if (error.response.data?.non_field_errors) {
        return {
          serverError:
            "Invalid email or password. Please check your credentials.",
        };
      }

      return {
        serverError:
          error.response.data?.error || "An error occurred during login",
      };
    }
    return {
      serverError: "An unexpected error occurred during login",
    };
  }
};
