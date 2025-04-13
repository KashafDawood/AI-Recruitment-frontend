import { z } from "zod";
import axiosInstance from "../axiosConfig";
import axios from "axios";

// Schema that matches the PublishJobListing serializer requirements
const createJobSchema = z.object({
  title: z.string().min(1, { message: "Job title is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  company: z.string().optional(),
  experience: z.string().min(1, { message: "Experience is required" }),
  experience_level: z.enum(["entry", "mid", "senior"]).optional(),
  salary: z.string().optional(),
  description: z
    .array(z.string())
    .min(1, { message: "Description is required" }),
  responsibilities: z.array(z.string()).optional(),
  required_qualifications: z.array(z.string()).optional(),
  preferred_qualifications: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  job_type: z
    .enum(["full time", "part time", "contract", "temporary", "internship"])
    .optional(),
  job_location_type: z.enum(["remote", "onsite", "hybrid"]).optional(),
  job_status: z.enum(["open", "closed", "draft"]).optional(),
});

export const createJob = async (_: unknown, formData: FormData) => {
  // Convert form data into the expected format
  const rawData = Object.fromEntries(formData.entries());

  // Handle array fields
  const processedData: Record<string, string | string[]> = {
    ...rawData,
    description: formData.getAll("description").map((value) => String(value)),
  };

  // Process optional arrays if they exist
  [
    "responsibilities",
    "required_qualifications",
    "preferred_qualifications",
    "benefits",
  ].forEach((field) => {
    if (formData.has(field)) {
      processedData[field] = formData
        .getAll(field)
        .map((value) => String(value));
    }
  });

  const result = createJobSchema.safeParse(processedData);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/publish/`,
      result.data
    );

    if (response.status === 201) {
      return {
        message: "Job listing successfully published!",
        job: response.data.job_listing,
        policyViolations: response.data.policy_violations,
        approved: response.data.approved,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        serverError:
          error.response.data?.error ||
          "An error occurred while publishing the job",
        fieldErrors: error.response.data || {},
      };
    }
    return {
      serverError: "An unexpected error occurred while publishing the job",
    };
  }
};
