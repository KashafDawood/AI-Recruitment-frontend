import axiosInstance from "../axiosConfig";

type EducationData = {
  degree_name: string;
  institute_name: string;
  start_date: string;
  end_date?: string | null;
  is_studying: boolean;
};

export const addEducation = async (educationData: EducationData) => {
  try {
    const response = await axiosInstance.post(
      "/api/users/education/",
      educationData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
