import axiosInstance from "../axiosConfig";
import { Application } from "@/types/job";
import { AxiosError } from "axios";

interface AIRecommendation {
  rank: number;
  candidate_id: string;
  application_id: string;
  candidate_name: string;
  match_score: number;
  match_reasons: {
    category: string;
    strength: string;
    details: string;
  }[];
  gaps: {
    category: string;
    importance: string;
    details: string;
  }[];
}

export interface AIRecommendationResponse {
  recommendations: AIRecommendation[];
  metadata: {
    total_candidates_evaluated: number;
    job_description_summary: string;
    processing_time_ms: number;
  };
}

/**
 * Fetches AI recommendations for job applicants
 * @param jobId The ID of the job
 * @param applications List of job applications to analyze
 * @returns AI recommendations response
 */
export const getAIRecommendations = async (
  jobId: number | string,
  applications: Application[]
): Promise<AIRecommendationResponse> => {
  try {
    const response = await axiosInstance.post("/api/ai/recommend-candidate/", {
      job_id: jobId,
      applications: applications,
    });
    return response.data.result;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        // Extract the specific error message from the response data
        const errorMessage =
          error.response.data?.error ||
          error.response.data?.message ||
          "An error occurred while generating recommendations";
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
    console.error("Error fetching AI recommendations:", error);
    throw new Error(
      `Unexpected error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
