import axios from "axios";
import axiosInstance from "../../axiosConfig";

export const getBio = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_URL}/api/users/me/`);
    return response.data.bio;
  } catch (error) {
    console.error("Error fetching bio:", error);
    return "";
  }
};

