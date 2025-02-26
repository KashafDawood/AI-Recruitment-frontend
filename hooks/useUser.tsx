import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { User } from "../store/userStore";

// export const useUser = (): User | null => {
//   const user = useUserStore((state) => state.user);
//   return user;
// };

export const getCurrentUser = (): User | null => {
  return useUserStore.getState().user;
};

export const useUserWithLoading = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
      setIsLoading(false);
    };
    loadUser();
  }, []);

  return { user, isLoading };
};
