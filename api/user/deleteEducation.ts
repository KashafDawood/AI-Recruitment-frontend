import axiosInstance from "../axiosConfig";

export const deleteEducation = async (degree_name: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/users/education/${encodeURIComponent(degree_name)}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
