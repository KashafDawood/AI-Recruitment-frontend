import { useUserStore } from "../store/userStore";
import { User } from "../store/userStore";

export const getCurrentUser = (): User | null => {
  return useUserStore.getState().user;
};

export const useUserWithLoading = () => {
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.loading);

  return { user, isLoading };
};
