import { getJobs as getMockJobs } from "@/services/mockJobs";
import type {
  Applicant,
  ApplicationStatusUpdate,
  CreateJobInput,
  JobApplication,
  LoginRequest,
  OtpChallenge,
  ReportJobInput,
  Seeker,
  SeekerSettings,
  Session,
  VerifyOtpRequest,
} from "@/types/platform";
import type { Job } from "@/types/jobs";

const STORAGE_KEYS = {
  applications: "jobify.preview.applications",
  savedJobs: "jobify.preview.savedJobs",
  seekerProfile: "jobify.preview.seekerProfile",
  employerJobs: "jobify.preview.employerJobs",
  seekerSettings: "jobify.preview.seekerSettings",
} as const;

export async function applyToJob(job: Job): Promise<JobApplication> {
  return requestApi<JobApplication>("/api/applications", {
    method: "POST",
    body: JSON.stringify({
      jobId: job.id,
      jobSlug: job.slug,
      jobTitle: job.title,
      employerName: job.employer.name,
    }),
  });
}

export async function createJob(input: CreateJobInput): Promise<Job> {
  return requestApi<Job>("/api/jobs", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function login(input: LoginRequest): Promise<OtpChallenge> {
  if (!input.email) throw new Error("Enter an email address to continue.");
  return requestApi<OtpChallenge>("/api/auth/request-code", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      role: input.role,
      purpose: input.purpose ?? "login",
      ...(input.fullName ? { fullName: input.fullName } : {}),
    }),
  });
}

export async function verifyOtp(input: VerifyOtpRequest): Promise<Session> {
  return requestApi<Session>("/api/auth/verify-code", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getSeekerProfile(): Promise<Seeker> {
  return readMockStorage<Seeker>(STORAGE_KEYS.seekerProfile, {
    id: "preview-seeker",
    fullName: "",
    headline: "",
    phone: "",
    skills: [],
    education: [],
    experience: [],
    portfolioLinks: [],
    profileCompleteness: 0,
  });
}

export async function updateSeekerProfile(
  profile: Partial<Seeker>,
): Promise<Seeker> {
  const current = await getSeekerProfile();
  const updated: Seeker = {
    id: current?.id ?? "preview-seeker",
    fullName: profile.fullName ?? current?.fullName ?? "",
    headline: profile.headline ?? current?.headline ?? "",
    phone: profile.phone ?? current?.phone ?? "",
    email: profile.email ?? current?.email,
    skills: profile.skills ?? current?.skills ?? [],
    education: profile.education ?? current?.education ?? [],
    experience: profile.experience ?? current?.experience ?? [],
    portfolioLinks: profile.portfolioLinks ?? current?.portfolioLinks ?? [],
    cvUrl: profile.cvUrl ?? current?.cvUrl,
    profileCompleteness: calculateProfileCompleteness({
      ...current,
      ...profile,
    }),
  };
  writeMockStorage(STORAGE_KEYS.seekerProfile, updated);
  return updated;
}

export async function getMyApplications(): Promise<JobApplication[]> {
  return requestApi<JobApplication[]>("/api/applications");
}

export async function getAuthSession(): Promise<{
  authenticated: boolean;
  session: {
    userId: string;
    role: "seeker" | "employer";
    email: string;
  } | null;
}> {
  return requestApi("/api/auth/session");
}

export async function getSeekerSettings(): Promise<SeekerSettings> {
  return readMockStorage<SeekerSettings>(STORAGE_KEYS.seekerSettings, {
    jobAlerts: true,
    applicationUpdates: true,
    marketingEmails: false,
  });
}

export async function updateSeekerSettings(
  settings: SeekerSettings,
): Promise<SeekerSettings> {
  writeMockStorage(STORAGE_KEYS.seekerSettings, settings);
  return settings;
}

export async function getSavedJobs(): Promise<Job[]> {
  const savedIds = readMockStorage<string[]>(STORAGE_KEYS.savedJobs, []);
  const { jobs } = await getMockJobs({ pageSize: Number.MAX_SAFE_INTEGER });
  return jobs.filter((job) => savedIds.includes(job.id));
}

export async function saveJob(
  jobId: string,
): Promise<{ jobId: string; isSaved: true }> {
  const savedJobs = readMockStorage<string[]>(STORAGE_KEYS.savedJobs, []);
  if (!savedJobs.includes(jobId)) {
    writeMockStorage(STORAGE_KEYS.savedJobs, [jobId, ...savedJobs]);
  }
  return { jobId, isSaved: true };
}

export async function unsaveJob(
  jobId: string,
): Promise<{ jobId: string; isSaved: false }> {
  const savedJobs = readMockStorage<string[]>(STORAGE_KEYS.savedJobs, []);
  writeMockStorage(
    STORAGE_KEYS.savedJobs,
    savedJobs.filter((savedId) => savedId !== jobId),
  );
  return { jobId, isSaved: false };
}

export async function reportJob(
  input: ReportJobInput,
): Promise<{ reportId: string; received: true }> {
  const job = await getMockJobById(input.jobId);
  if (!job) throw new Error("This job could not be found.");
  return { reportId: `mock-report-${job.id}`, received: true };
}

export async function getMyJobs(): Promise<Job[]> {
  return requestApi<Job[]>("/api/jobs/mine");
}

export async function getApplicants(jobId: string): Promise<Applicant[]> {
  return requestApi<Applicant[]>(
    `/api/applications?jobId=${encodeURIComponent(jobId)}`,
  );
}

export async function updateApplicationStatus(
  update: ApplicationStatusUpdate,
): Promise<{
  applicationId: string;
  status: ApplicationStatusUpdate["status"];
}> {
  return requestApi(
    `/api/applications/${encodeURIComponent(update.applicationId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: update.status }),
    },
  );
}

export async function uploadCv(
  file: File,
): Promise<{ cvUrl: string; fileName: string }> {
  const isSupportedType =
    file.type === "application/pdf" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    /\.(pdf|docx)$/i.test(file.name);
  if (!isSupportedType) {
    throw new Error("Choose a PDF or DOCX file.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Choose a CV smaller than 5 MB.");
  }
  return {
    cvUrl: `preview-file:${encodeURIComponent(file.name)}`,
    fileName: file.name,
  };
}

async function getMockJobById(jobId: string): Promise<Job | null> {
  const { jobs } = await getMockJobs({ pageSize: Number.MAX_SAFE_INTEGER });
  return jobs.find((job) => job.id === jobId) ?? null;
}

async function requestApi<T>(url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const result: unknown = await response.json();
  if (!response.ok) {
    const message =
      result &&
      typeof result === "object" &&
      "error" in result &&
      typeof result.error === "string"
        ? result.error
        : "The request could not be completed.";
    const error = new Error(message) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  return result as T;
}

function readMockStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const storedValue = window.localStorage.getItem(key);
  return storedValue === null ? fallback : (JSON.parse(storedValue) as T);
}

function writeMockStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    throw new Error("Preview changes are only available in a browser session.");
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function calculateProfileCompleteness(profile: Partial<Seeker>): number {
  const completedFields = [
    Boolean(profile.fullName?.trim()),
    Boolean(profile.headline?.trim()),
    Boolean(profile.skills?.length),
    Boolean(profile.education?.length),
    Boolean(profile.experience?.length),
    Boolean(profile.portfolioLinks?.length),
    Boolean(profile.cvUrl),
  ].filter(Boolean).length;
  return Math.round((completedFields / 7) * 100);
}
