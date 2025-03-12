import axiosInstance from "../axiosConfig";
import { AxiosError } from "axios";

export const generateBio = async () => {
  try {
    const response = await axiosInstance.post(
      "/api/ai/generate-candidate-bio/"
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // Extract the specific error message from the response data
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "An error occurred while generating bio";
        throw { message: errorMessage };
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("Network error: No response received from server");
      } else {
        // Something happened in setting up the request
        throw new Error(`Request error: ${error.message}`);
      }
    }
    // For non-Axios errors
    throw new Error(
      `Unexpected error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
