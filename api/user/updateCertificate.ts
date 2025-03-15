import { Certification } from "@/store/userStore";
import axiosInstance from "../axiosConfig";

type ExtendCertificate = Certification & {
  original_certification_name?: string;
};

export const updateCertificate = async (
  certificationData: ExtendCertificate
) => {
  try {
    // Use the original certification name if provided, otherwise use the current one
    const certificationToUpdate =
      certificationData.original_certification_name ||
      certificationData.certification_name ||
      "";

    // Remove the original_certification_name field before sending to API
    const { ...dataToSend } = certificationData;

    const response = await axiosInstance.put(
      `/api/users/certification/${encodeURIComponent(certificationToUpdate)}`,
      dataToSend
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
