import axiosInstance from "../axiosConfig";

export const getSavedJobs = async ( pageNumber: number, limit: number ) => {
  try {
    const response = await axiosInstance.get(
      `${process.env.NEXT_PUBLIC_URL}/api/jobs/saved/`,
       {params: { page: pageNumber, limit: limit } }
    );
    return response.data;
  } catch (error) {
    console.error("There was an error fetching your saved jobs!", error);
    return [];
  }
};
