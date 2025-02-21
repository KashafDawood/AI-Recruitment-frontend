import axios from "axios";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address!" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be 8 character long!" })
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
      "http://127.0.0.1:8000/api/users/login/",
      result.data,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === 200) {
      return { message: "Login successful", user: response.data.user };
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    return {
      errors: {
        email: ["An error occurred during login"],
      },
    };
  }
};
