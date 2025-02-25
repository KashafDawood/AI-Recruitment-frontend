import axios from "axios";
import { useUserStore } from "../../store/userStore";

export const getme = async () => {
  const { setUser, setLoading, setError } = useUserStore.getState();
  setLoading(true);
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_URL}/api/users/me/`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setUser(response.data);
    setLoading(false);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      setError(error.message);
    } else {
      setError("An unknown error occurred");
    }
    setLoading(false);
    throw error;
  }
};
