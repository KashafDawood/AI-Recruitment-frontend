export interface Employer {
  username: string;
  name: string;
  photo: string;
  company_name: string;
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
  employer: Employer | null;
}
