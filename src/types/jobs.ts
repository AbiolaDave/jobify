export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance/Gig"
  | "NYSC-friendly";

export type ExperienceLevel = "Entry-level" | "Junior" | "Mid-level";
export type ApplicationStatus =
  | "Applied"
  | "Viewed"
  | "Shortlisted"
  | "Rejected";

export interface Employer {
  id: string;
  name: string;
  initials: string;
  industry: string;
  isVerified: boolean;
  location: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  employer: Employer;
  state: string;
  city: string;
  isRemote: boolean;
  type: EmploymentType;
  level: ExperienceLevel;
  category: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryPeriod?: "monthly" | "yearly";
  summary: string;
  description: string;
  requirements: string[];
  postedAt: string;
  isFeatured: boolean;
  whatsappPhone?: string;
  externalUrl?: string;
}

export interface JobFilters {
  query?: string;
  state?: string;
  remote?: boolean;
  type?: EmploymentType;
  level?: ExperienceLevel;
  category?: string;
  minSalary?: number;
  maxSalary?: number;
  sort?: "newest" | "salary";
  page?: number;
  pageSize?: number;
}

export interface JobSearchResult {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  warning?: string;
}
