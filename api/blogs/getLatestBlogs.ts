import axios from "axios";
import axiosInstance from "../axiosConfig";

export const getLatestBlogs = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_URL}/api/blogs/latest/`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the blogs!", error);
    return [];
  }
};
