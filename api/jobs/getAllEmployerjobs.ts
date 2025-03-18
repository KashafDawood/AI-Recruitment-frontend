import axiosInstance from "../axiosConfig";

export const getAllEmployerJobs = async (username: string) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/employers/${username}/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
