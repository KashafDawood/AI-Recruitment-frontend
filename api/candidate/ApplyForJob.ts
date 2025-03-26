import axiosInstance from "../axiosConfig";

interface ApplyJobData {
  resume: string;
  job: number;
}

export const applyForJob = async (data: ApplyJobData) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/applications/apply/`,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Something went wrong" };
  }
};
