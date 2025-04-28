import { z } from "zod";
import axiosInstance from "../axiosConfig";
import axios from "axios";

// Schema matching the frontend job update requirements
const updateJobSchema = z.object({
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

export type UpdateJobData = z.infer<typeof updateJobSchema>;

export const updateJob = async (
  jobId: string | number,
  jobData: UpdateJobData
) => {
  try {
    const result = updateJobSchema.safeParse(jobData);

    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
      };
    }

    const response = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/my-job-listing/${jobId}`,
      result.data
    );

    return {
      success: true,
      message: "Job updated successfully",
      job: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        success: false,
        serverError:
          error.response.data?.error ||
          "An error occurred while updating the job",
        fieldErrors: error.response.data || {},
      };
    }
    return {
      success: false,
      serverError: "An unexpected error occurred while updating the job",
    };
  }
};
