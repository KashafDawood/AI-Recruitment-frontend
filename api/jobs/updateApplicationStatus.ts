import { ApplicationStatus } from "@/types/job";
import axiosInstance from "../axiosConfig";

export const updateApplicationStatus = async (
  jobId: number | string,
  applicationIds: number[],
  newStatus: ApplicationStatus
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await axiosInstance.patch(
      `${process.env.NEXT_PUBLIC_URL}/api/applications/job/${jobId}/update-status/`,
      {
        application_ids: applicationIds,
        application_status: newStatus,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating application status:", error);
    throw error;
  }
};
