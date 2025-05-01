import axiosInstance from "../axiosConfig";

export const getAppliedJobs = async ( pageNumber: number, limit: number ) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/applications/applied/`,
       {params: { page: pageNumber, limit: limit } }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error fetching your applied jobs!", error);
    return [];
  }
};
