import axiosInstance from "../axiosConfig";

/**
 * Updates the status of a job listing
 * @param jobId The ID of the job to update
 * @param newStatus The new status to set ('open', 'closed', or 'draft')
 * @returns Promise with the updated job data
 */
export const updateJobStatus = async (
  jobId: string | number,
  newStatus: "open" | "closed" | "draft"
): Promise<{
  message: string;
  job_id: string | number;
  job_status: string;
}> => {
  try {
    const response = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/${jobId}/update-status/`,
      { job_status: newStatus }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating job status:", error);
    throw error;
  }
};
