import "server-only";
import {
  getFeaturedJobs as getJobbleFeaturedJobs,
  getJob as getJobbleJob,
  getJobs as getJobbleJobs,
} from "@/services/jobble";
import type { Job, JobFilters, JobSearchResult } from "@/types/jobs";

export const getJobs = (filters: JobFilters = {}): Promise<JobSearchResult> =>
  getJobbleJobs(filters);

export const getFeaturedJobs = (
  limit = 3,
): Promise<{ jobs: Job[]; warning?: string }> => getJobbleFeaturedJobs(limit);

export const getJob = (slug: string): Promise<Job | null> => getJobbleJob(slug);
