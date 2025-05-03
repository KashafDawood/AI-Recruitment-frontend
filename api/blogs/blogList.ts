import axiosInstance from "../axiosConfig";

export const blogList = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/blogs/`, {
        params: {
          page: page,   // Ensure we're using "page"
          limit: limit, // Ensure it matches Django's "page_size_query_param"
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
