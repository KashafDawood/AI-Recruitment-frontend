import axiosInstance from "../axiosConfig";

export const updateBio = async (bio: string) => {
  try {
    const response = await axiosInstance.post(
      "/api/users/candidate/update-bio/",
      { bio }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
