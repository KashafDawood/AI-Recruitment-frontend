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

// Additional type specifically for job preview data from form
export interface JobPreviewData {
  title?: string;
  company?: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  salary?: string;
  description?: string;
  required_qualifications?: string;
  preferred_qualifications?: string;
  responsibilities?: string;
  benefits?: string;
  industry?: string;
  job_location_type?: string;
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
