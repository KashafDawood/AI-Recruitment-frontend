import axios from "axios";
import { z } from "zod";
import { createSession } from "@/app/_lib/session";

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
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/users/signup/`,
      result.data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      const user = response.data.user;
      await createSession(user.id, user.role);
      return {
        message: "signup successful",
        user: response.data.user,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        serverError:
          error.response.data?.non_field_errors?.[0] ||
          "An error occurred during signup",
      };
    }
    return {
      serverError: "An unexpected error occurred during signup",
    };
  }
};
