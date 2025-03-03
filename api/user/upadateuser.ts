import axiosInstance from "../axiosConfig";

// Update the function to accept FormData instead of a partial User object
export const updateMe = async (formData: FormData) => {
  try {
    // Use proper Content-Type header for FormData
    const response = await axiosInstance.put(
      "/api/users/update-me/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
