import axiosInstance from "../axiosConfig";

export const saveJob = async (job_id: Number) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/${job_id}/save/`
    );
    return response.data;
  } catch (error) {
    console.error("There was an error while saving the job!", error);
    return [];
  }
};
