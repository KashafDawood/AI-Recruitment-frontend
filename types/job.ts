export interface Employer {
  username: string;
  name: string;
  photo: string;
  company_name: string;
  address: string;
  industry: string;
  about_company: string;
  company_size: string;
}

// Application interface for job applications// Update this interface in types/job.ts
export interface Application {
  id: number;
  job: number;
  candidate: number; // Now just the ID
  candidate_username: string;
  candidate_name: string;
  candidate_photo: string | null;
  candidate_email: string;
  job_title: string;
  resume: string;
  application_status:
    | "pending"
    | "reviewing"
    | "shortlisted"
    | "interviewed"
    | "rejected"
    | "hired";
  created_at: string;
  extracted_resume?: string;
}

// Additional type specifically for job preview data from form
export interface JobPreviewData {
  title?: string;
  company?: string;
  location?: string;
  job_type?: string;
  experience?: string;
  experience_level?: string;
  salary?: string;
  description?: string | string[];
  required_qualifications?: string | string[];
  preferred_qualifications?: string | string[];
  responsibilities?: string | string[];
  benefits?: string | string[];
  industry?: string;
  job_location_type?: string;
  job_status?: string;
  employer?: Employer;
}

export interface Job {
  id: number;
  title: string;
  job_status: string;
  salary: string;
  location: string;
  company: string;
  description: string;
  job_location_type: string;
  job_type: string;
  experience_required: string;
  experience_level: string;
  required_qualifications: string[];
  preferred_qualifications: string[];
  responsibilities: string[];
  benefits: string[];
  created_at: string;
  applicants: BigInteger;
  has_applied: boolean;
  is_saved: boolean;
  employer: Employer | null;
}
