import axios from "axios";
import axiosInstance from "../axiosConfig";

export const getBlog = async (slug: string) => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_URL}/api/blogs/${slug}`);
    return response.data;
  } catch (error) {
    console.error("There was an error fetching the blog!", error);
    return [];
  }
};
