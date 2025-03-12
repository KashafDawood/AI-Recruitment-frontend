import axiosInstance from "../axiosConfig";

export const blogList = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_URL}/api/blogs/`);
    console.log("API Response:", response.data); // Debugging: Log the API response
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the blogs!", error);
    return [];
  }
};
