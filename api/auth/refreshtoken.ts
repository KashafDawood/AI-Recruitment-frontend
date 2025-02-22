import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const useTokenRefresh = () => {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axios.post(`${process.env.PUBLIC_URL}/api/users/token/refresh/`);
      } catch (error) {
        console.error("Failed to refresh token", error);
        router.push("/login");
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes

    return () => clearInterval(interval);
  }, [router]);
};

export default useTokenRefresh;
