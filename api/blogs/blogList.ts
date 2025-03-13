import axiosInstance from "../axiosConfig";

export const blogList = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/blogs/`
    ); // Debugging: Log the API response
    return response.data;
  } catch (error) {
    throw error;
  }
};
