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
  description: z.string().min(1, { message: "Description is required" }),
  responsibilities: z.string().optional(),
  required_qualifications: z.string().optional(),
  preferred_qualifications: z.string().optional(),
  benefits: z.string().optional(),
  job_type: z
    .enum(["full time", "part time", "contract", "temporary", "internship"])
    .optional(),
  job_location_type: z.enum(["remote", "onsite", "hybrid"]).optional(),
  job_status: z.enum(["open", "closed", "draft"]).optional(),
});

// Helper function to convert multi-line string to array
const textToArray = (text: string | null | undefined): string[] => {
  if (!text) return [];
  return text.split("\n").filter((line) => line.trim() !== "");
};

export const createJob = async (_: unknown, formData: FormData) => {
  // Convert form data into the expected format
  const rawData = Object.fromEntries(formData.entries());

  // Process data to ensure proper types
  const processedData: Record<string, any> = { ...rawData };

  // Format multi-line fields for the backend, which expects arrays
  const arrayFields = [
    "responsibilities",
    "required_qualifications",
    "preferred_qualifications",
    "benefits",
  ];

  arrayFields.forEach((field) => {
    if (field in processedData && typeof processedData[field] === "string") {
      processedData[field] = textToArray(processedData[field]);
    }
  });

  // Validate the data
  const result = createJobSchema.safeParse(processedData);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Convert string fields to arrays before sending to the API
    const dataToSend = {
      ...result.data,
      description: textToArray(result.data.description),
      responsibilities: textToArray(result.data.responsibilities),
      required_qualifications: textToArray(result.data.required_qualifications),
      preferred_qualifications: textToArray(
        result.data.preferred_qualifications
      ),
      benefits: textToArray(result.data.benefits),
    };

    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/publish-job-post/`,
      dataToSend
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
