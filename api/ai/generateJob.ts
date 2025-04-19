import { z } from "zod";
import axiosInstance from "../axiosConfig";
import axios from "axios";

// Schema for AI job generation that matches the GenerateJobListing serializer
const generateJobSchema = z.object({
  job_title: z.string().min(1, { message: "Job title is required" }),
  company: z.string().min(1, { message: "Company name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  experience_required: z.string().min(1, { message: "Experience is required" }),
  salary_range: z.string().optional(),
});

export const generateJobWithAI = async (_: unknown, formData: FormData) => {
  // Convert form data to object
  const rawData = Object.fromEntries(formData.entries());

  // Validate the data
  const result = generateJobSchema.safeParse(rawData);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/ai/generate-job-post/`,
      result.data
    );

    if (response.status === 200) {
      return {
        message: "Job listing successfully generated!",
        job_listing: response.data.job_listing,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        serverError:
          error.response.data?.error ||
          "An error occurred while generating the job",
        fieldErrors: error.response.data || {},
      };
    }
    return {
      serverError: "An unexpected error occurred while generating the job",
    };
  }
};
