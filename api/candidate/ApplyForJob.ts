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
      const responseData = (error as { response?: { data: unknown } }).response
        ?.data;

      // Check for the "already applied" error message
      if (
        responseData &&
        typeof responseData === "object" &&
        "detail" in responseData &&
        typeof responseData.detail === "string" &&
        responseData.detail.includes("You have already applied for this job")
      ) {
        throw {
          message: "You have already applied for this job",
          alreadyApplied: true,
        };
      }

      throw responseData || { message: "Something went wrong" };
    }
    throw { message: "Something went wrong" };
  }
};
