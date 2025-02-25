import { useUserStore } from "../../store/userStore";
import axiosInstance from "../axiosConfig";

export const getme = async () => {
  const { setUser, setLoading, setError } = useUserStore.getState();
  setLoading(true);
  try {
    const response = await axiosInstance.get(`/api/users/me/`);
    setUser(response.data);
    setLoading(false);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      setError(error.message || "An unknown error occurred");
    } else {
      setError("An unknown error occurred");
    }
    setLoading(false);
    throw error;
  }
};
