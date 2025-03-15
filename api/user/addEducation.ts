import { Education } from "@/store/userStore";
import axiosInstance from "../axiosConfig";

export const addEducation = async (educationData: Education) => {
  try {
    const response = await axiosInstance.post(
      "/api/users/education/",
      educationData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
