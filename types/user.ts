export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  verifyEmail?: boolean;
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
