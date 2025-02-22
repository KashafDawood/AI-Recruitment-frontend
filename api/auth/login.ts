import axios from "axios";
import { z } from "zod";
import { createSession } from "@/app/_lib/session";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address!" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be 8 characters long!" })
    .trim(),
});

export const login = async (_: unknown, formData: FormData) => {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}/api/users/login/`,
      result.data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === 200) {
      const user = response.data.user;
      console.log(response.data);
      await createSession(user.id, user.role);
      return {
        message: "Login successful",
        user: response.data.user,
      };
    }

    return {
      errors: {
        email: ["Invalid login credentials"],
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      errors: {
        email: ["An error occurred during login"],
      },
    };
  }
};
