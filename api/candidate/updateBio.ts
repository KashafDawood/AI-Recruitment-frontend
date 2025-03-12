import axiosInstance from "../axiosConfig";

export const updateBio = async (bio: string) => {
  try {
    // Ensure we're sending a valid string
    if (typeof bio !== "string") {
      throw new Error("Bio must be a valid string");
    }

    const response = await axiosInstance.post(
      "/api/users/candidate/update-bio/",
      { bio }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
