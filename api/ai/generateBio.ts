import axiosInstance from "../axiosConfig";

export const generateBio = async () => {
  try {
    const response = await axiosInstance.post(
      "/api/ai/generate-candidate-bio/"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
