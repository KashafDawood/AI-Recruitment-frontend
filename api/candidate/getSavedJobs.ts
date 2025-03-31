import axiosInstance from "../axiosConfig";

export const getSavedJobs = async () => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/saved/`
    );
    return response.data;
  } catch (error) {
    console.error("There was an error fetching your saved jobs!", error);
    return [];
  }
};
