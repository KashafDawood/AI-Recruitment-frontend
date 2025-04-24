import axiosInstance from "../axiosConfig";
import { AxiosError } from "axios";

export interface ContractGenerationRequest {
  app_id: string | number;
  start_date: string;
  end_date?: string;
  terms?: string;
}

export interface ContractGenerationResponse {
  status: string;
  message: string;
  contract_url: string;
  candidate_name: string;
  job_title: string;
  company: string;
}

/**
 * Generates an employment contract for a hired candidate
 * @param requestData Contract generation parameters
 * @returns Contract generation response with URL to the generated contract
 */
export const generateContract = async (
  requestData: ContractGenerationRequest
): Promise<ContractGenerationResponse> => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/ai/generate-contract/`,
      requestData
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // Extract the specific error message from the response data
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "An error occurred while generating the contract";
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
    console.error("Error generating contract:", error);
    throw new Error(
      `Unexpected error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
