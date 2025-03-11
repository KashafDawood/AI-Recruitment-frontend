import { useUserStore } from "../store/userStore";
import { User } from "../store/userStore";

/**
 * Gets the current user without subscribing to state changes.
 * Use this in non-React contexts or when you need the latest user value
 * at the moment of execution (e.g., in event handlers or callbacks).
 */
export const getCurrentUser = (): User | null => {
  return useUserStore.getState().user;
};

/**
 * React hook that subscribes to user state changes.
 * Use this in React components to reactively update when the user changes.
 * Components using this will re-render when user or loading state changes.
 */
export const useUserWithLoading = () => {
  const user = useUserStore((state) => state.user);
  const isLoading = useUserStore((state) => state.loading);

  return { user, isLoading };
};
