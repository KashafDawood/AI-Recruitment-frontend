import axiosInstance from "../axiosConfig";
import { Job } from "@/types/job";

/**
 * Fetches a job listing by ID
 * @param jobId - The ID of the job to fetch
 * @returns Promise with job data
 */
export const getJobById = async (jobId: string): Promise<Job> => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/my-job-listing/${jobId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error;
  }
};
