import { Education } from "@/store/userStore";
import axiosInstance from "../axiosConfig";

type ExtendEducation = Education & {
  original_degree_name?: string;
};

export const updateEducation = async (educationData: ExtendEducation) => {
  try {
    // Use the original degree name if provided, otherwise use the current one
    const degreeToUpdate =
      educationData.original_degree_name || educationData.degree_name;

    // Remove the original_degree_name field before sending to API
    const { ...dataToSend } = educationData;

    const response = await axiosInstance.put(
      `/api/users/education/${encodeURIComponent(degreeToUpdate)}`,
      dataToSend
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
