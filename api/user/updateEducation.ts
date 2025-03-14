import axiosInstance from "../axiosConfig";

type EducationData = {
  degree_name: string;
  original_degree_name?: string; // Added for identifying which education to update
  institute_name: string;
  start_date: string;
  end_date?: string | null;
  is_studying: boolean;
};

export const updateEducation = async (educationData: EducationData) => {
  try {
    // Use the original degree name if provided, otherwise use the current one
    const degreeToUpdate =
      educationData.original_degree_name || educationData.degree_name;

    // Remove the original_degree_name field before sending to API
    const { original_degree_name, ...dataToSend } = educationData;

    const response = await axiosInstance.put(
      `/api/users/education/${encodeURIComponent(degreeToUpdate)}`,
      dataToSend
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
