import { useUserStore } from "../store/userStore";
import { User } from "../store/userStore";

export const useUser = (): User | null => {
  const user = useUserStore((state) => state.user);
  return user;
};

export const getCurrentUser = (): User | null => {
  return useUserStore.getState().user;
};
