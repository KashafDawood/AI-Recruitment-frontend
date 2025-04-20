import axiosInstance from "../axiosConfig";
import { Application } from "@/types/job";

/**
 * Fetches all applications for a specific job
 * @param jobId - The ID of the job to fetch applications for
 * @returns Promise with applications data
 */
export const getJobApplications = async (
  jobId: string | number
): Promise<Application[]> => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/applications/job/${jobId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching job applications:", error);
    throw error;
  }
};
