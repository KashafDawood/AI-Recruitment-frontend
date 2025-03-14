import { z } from "zod";
import axiosInstance from "../axiosConfig";

// Define validation schema for education
const educationSchema = z.object({
  degree_name: z.string().min(2, { message: "Degree name is required" }),
  institute_name: z.string().min(2, { message: "Institute name is required" }),
  start_date: z.string().min(1, { message: "Start date is required" }),
  end_date: z.string().optional().nullable(),
});

export const addEducation = async (_: unknown, formData: FormData) => {
  // Parse and validate form data
  const result = educationSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  // Process the data before sending to API
  const educationData = {
    degree_name: result.data.degree_name,
    institute_name: result.data.institute_name,
    start_date: result.data.start_date,
    end_date: result.data.end_date,
  };

  try {
    // Send educationData directly as the request body instead of nesting it
    const response = await axiosInstance.post(
      "/api/users/education/",
      educationData
    );

    return {
      message: "Education added successfully",
      education: response.data,
    };
  } catch (error: unknown) {
    const errorMessage =
      error && typeof error === "object" && "response" in error
        ? (error.response as { data?: { error?: string } })?.data?.error
        : "Failed to add education";

    return {
      serverError: errorMessage,
    };
  }
};
