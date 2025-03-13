import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getme } from "@/api/auth/getme";

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  photo?: string | null;
  phone?: string | null;
  website?: string | null;
  socials?: Record<string, string> | null;
  certifications?: (string | Certification)[];
  education?: Record<string, Education>;
  experience?: number;
  interests?: string;
  skills?: {
    skills: string[];
  };
  bio?: string;
  resumes?: Record<
    string,
    {
      name: string;
      resume: string;
      created_at: string;
    }
  >;
  company_name?: string;
  logo?: string;
  industry?: string;
}

export interface Certification {
  source?: string;
  date_obtained?: string;
  certification_name?: string;
}

export interface Education {
  end_date: string | null;
  start_date: string;
  degree_name: string;
  is_studying: boolean;
  institute_name: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getUser: () => User | null;
  refreshUser: () => Promise<User | null>;
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
      refreshUser: async () => {
        try {
          const userData = await getme();
          set({ user: userData });
          return userData;
        } catch (error) {
          console.error("Failed to refresh user data:", error);
          return null;
        }
      },
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
