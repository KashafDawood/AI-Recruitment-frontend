import { Certification } from "@/store/userStore";
import axiosInstance from "../axiosConfig";

export const addCertificate = async (certificateData: Certification) => {
  try {
    const response = await axiosInstance.post(
      "/api/users/certification/",
      certificateData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
