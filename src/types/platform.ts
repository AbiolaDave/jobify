import type { ApplicationStatus, Job } from "@/types/jobs";

export type UserRole = "seeker" | "employer";

export interface Seeker {
  id: string;
  fullName: string;
  headline: string;
  phone: string;
  email?: string;
  skills: string[];
  education: Array<{
    institution: string;
    qualification: string;
    year?: number;
  }>;
  experience: Array<{
    organisation: string;
    title: string;
    description?: string;
  }>;
  portfolioLinks: string[];
  cvUrl?: string;
  profileCompleteness: number;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobSlug: string;
  jobTitle: string;
  employerName: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Applicant {
  application: JobApplication;
  seeker: Pick<Seeker, "id" | "fullName" | "headline" | "skills" | "education" | "experience" | "cvUrl">;
}

export interface LoginRequest {
  role: UserRole;
  purpose?: "signup" | "login";
  phone?: string;
  email?: string;
  fullName?: string;
}

export interface OtpChallenge {
  challengeId: string;
  destination: string;
  expiresInSeconds: number;
}

export interface VerifyOtpRequest {
  challengeId: string;
  code: string;
}

export interface Session {
  userId: string;
  role: UserRole;
}

export type CreateJobInput = Pick<
  Job,
  | "title"
  | "state"
  | "city"
  | "isRemote"
  | "type"
  | "level"
  | "category"
  | "salaryMin"
  | "salaryMax"
  | "salaryPeriod"
  | "summary"
  | "description"
  | "requirements"
  | "whatsappPhone"
>;

export interface ReportJobInput {
  jobId: string;
  reason: "scam" | "incorrect" | "discrimination" | "other";
  details?: string;
}

export interface ApplicantsQuery {
  jobId: string;
}

export interface ApplicationStatusUpdate {
  applicationId: string;
  status: ApplicationStatus;
}

export interface SeekerSettings {
  jobAlerts: boolean;
  applicationUpdates: boolean;
  marketingEmails: boolean;
}
