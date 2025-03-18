import axiosInstance from "../axiosConfig";

export const blogList = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/blogs/`, {
        params: {
          page: page,
          limit: limit
        }
      }
    );
    return response.data.results;
  } catch (error) {
    throw error;
  }
};
