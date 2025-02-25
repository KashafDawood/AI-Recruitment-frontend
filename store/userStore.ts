import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Certification {
  source?: string;
  date_obtained?: string;
  certification_name?: string;
}

interface Education {
  end_date: string | null;
  start_date: string;
  degree_name: string;
  is_studying: boolean;
  institute_name: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role?: string;
  photo: string | null;
  phone: string | null;
  website: string | null;
  socials: Record<string, string> | null;
  certifications?: (string | Certification)[];
  education?: Record<string, Education>;
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
