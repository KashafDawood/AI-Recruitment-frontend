import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User, Certification, Education } from "@/types/user";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getUser: () => User | null;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      setUser: (user) => set({ user }),
      clearUser: () => {
        set({ user: null });
        localStorage.removeItem("user-store");
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      getUser: () => get().user,
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Add a direct export of the current user for simpler imports
export const currentUser = {
  get data(): User | null {
    return useUserStore.getState().user;
  },
};
