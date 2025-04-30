import axios from "../axiosConfig";

export interface GenerateBlogRequest {
  blog_title: string;
  blog_description: string;
  blog_keywords?: string;
  blog_length?: string;
}

export interface GenerateBlogResponse {
  blog: string;
}

export const generateBlog = async (
  data: GenerateBlogRequest
): Promise<GenerateBlogResponse> => {
  try {
    const response = await axios.post<GenerateBlogResponse>(
      "/api/ai/generate-blog-post/",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error generating blog post:", error);
    throw error;
  }
};
