import axiosInstance from "../axiosConfig";

interface ApplyJobData {
  resume: string | null;
  job: number;
}

export const applyForJob = async (data: ApplyJobData) => {
  try {
    const response = await axiosInstance.post(
      `${process.env.NEXT_PUBLIC_URL}/api/applications/apply/`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      throw (
        (error as { response?: { data: unknown } }).response?.data || {
          message: "Something went wrong",
        }
      );
    }
    throw { message: "Something went wrong" };
  }
};
