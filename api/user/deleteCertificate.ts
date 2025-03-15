import axiosInstance from "../axiosConfig";

export const deleteCertification = async (certification_name: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/users/certification/${encodeURIComponent(certification_name)}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
