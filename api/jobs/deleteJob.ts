import axiosInstance from "../axiosConfig";

/**
 * Deletes a job listing
 * @param jobId The ID of the job to delete
 * @returns Promise with the deletion response
 */
export const deleteJob = async (
  jobId: string | number
): Promise<{
  message: string;
  job_id: string | number;
}> => {
  try {
    await axiosInstance.delete(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/my-job-listing/${jobId}`
    );

    return {
      message: "Job successfully deleted",
      job_id: jobId,
    };
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
