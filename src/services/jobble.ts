import {
  getJob as getMockJob,
  getJobs as getMockJobs,
} from "@/services/mockJobs";
import type {
  EmploymentType,
  ExperienceLevel,
  Job,
  JobFilters,
  JobSearchResult,
} from "@/types/jobs";

interface JoobleJob {
  id?: string;
  title?: string;
  location?: string;
  snippet?: string;
  salary?: string;
  type?: string;
  link?: string;
  updated?: string;
  company?: string;
}

interface JoobleResponse {
  jobs?: JoobleJob[];
  totalCount?: number;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function amountFromSalary(salary?: string): number | undefined {
  if (!salary) return undefined;
  const numbers = salary.match(/\d[\d,.]*/g);
  if (!numbers?.length) return undefined;
  const amount = Number(numbers[0].replace(/[,.]/g, ""));
  return Number.isFinite(amount) ? amount : undefined;
}

function validListingUrl(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function employmentType(value?: string): EmploymentType {
  const type = value?.toLowerCase() ?? "";
  if (type.includes("intern")) return "Internship";
  if (type.includes("part")) return "Part-time";
  if (type.includes("contract")) return "Contract";
  if (type.includes("freelance") || type.includes("gig"))
    return "Freelance/Gig";
  return "Full-time";
}

function mapJob(source: JoobleJob): Job {
  const title = source.title?.trim() || "Job opportunity";
  const company = source.company?.trim() || "Employer not listed";
  const location = source.location?.trim() || "Nigeria";
  const [city = location, ...stateParts] = location
    .split(",")
    .map((part) => part.trim());
  const state = stateParts.join(", ") || city;
  const summary =
    source.snippet
      ?.replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim() || "View the original listing for role details.";
  const id = source.id?.trim() || `${slugify(title)}-${slugify(company)}`;
  const salary = amountFromSalary(source.salary);
  const updatedAt = source.updated ? new Date(source.updated) : null;
  const postedAt =
    updatedAt && !Number.isNaN(updatedAt.getTime())
      ? updatedAt.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
  const externalUrl = validListingUrl(source.link);
  return {
    id: `jooble-${id}`,
    slug: `${slugify(title)}-${slugify(company)}--jooble--${slugify(id)}`,
    title,
    employer: {
      id: slugify(company) || "employer",
      name: company,
      initials: company.slice(0, 2).toUpperCase(),
      industry: "Not specified",
      isVerified: false,
      location,
    },
    state,
    city,
    isRemote: /remote/i.test(location),
    type: employmentType(source.type),
    level: "Entry-level" satisfies ExperienceLevel,
    category: title.split(/\s+/).slice(-1)[0] || "Other",
    ...(salary !== undefined ? { salaryMin: salary, salaryMax: salary } : {}),
    summary,
    description: summary,
    requirements: [],
    postedAt,
    isFeatured: false,
    ...(externalUrl ? { externalUrl } : {}),
  };
}

async function searchJooble(
  filters: JobFilters = {},
): Promise<JobSearchResult> {
  const key = process.env.JOBBLE_API;
  if (!key) return getMockJobs(filters);

  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize ?? 6));

  try {
    const response = await fetch(`https://jooble.org/api/${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        keywords: filters.query?.trim() || "jobs",
        location:
          filters.state && filters.state !== "Remote"
            ? filters.state
            : "Nigeria",
        page,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      const warning = `Jooble job search failed (HTTP ${response.status}); showing sample listings instead.`;
      console.error(warning);
      return { ...(await getMockJobs(filters)), warning };
    }

    const payload = (await response.json()) as JoobleResponse;
    const jobs = Array.isArray(payload.jobs) ? payload.jobs.map(mapJob) : [];
    const matching = jobs.filter(
      (job) =>
        (!filters.remote || job.isRemote) &&
        (!filters.type || job.type === filters.type) &&
        (!filters.level || job.level === filters.level) &&
        (!filters.category ||
          job.category.toLowerCase() === filters.category.toLowerCase()) &&
        (filters.minSalary === undefined ||
          (job.salaryMax !== undefined &&
            job.salaryMax >= filters.minSalary)) &&
        (filters.maxSalary === undefined ||
          (job.salaryMin !== undefined && job.salaryMin <= filters.maxSalary)),
    );

    if (filters.sort === "salary") {
      matching.sort(
        (first, second) => (second.salaryMax ?? 0) - (first.salaryMax ?? 0),
      );
    }

    const total =
      typeof payload.totalCount === "number"
        ? payload.totalCount
        : matching.length;

    return {
      jobs: matching.slice(0, pageSize),
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  } catch (error) {
    const warning =
      "Jooble could not be reached; showing sample listings instead.";
    console.error(warning, error);
    return { ...(await getMockJobs(filters)), warning };
  }
}

export const getJobs = (filters: JobFilters = {}) => searchJooble(filters);

export async function getFeaturedJobs(
  limit = 3,
): Promise<{ jobs: Job[]; warning?: string }> {
  const result = await searchJooble({ page: 1, pageSize: limit });
  return {
    jobs: result.jobs.slice(0, limit),
    warning: result.warning,
  };
}

export async function getJob(slug: string): Promise<Job | null> {
  if (!process.env.JOBBLE_API) return getMockJob(slug);
  const separator = slug.indexOf("--jooble--");
  const searchTerms = (
    separator >= 0 ? slug.slice(0, separator) : slug
  ).replace(/-/g, " ");
  const { jobs } = await searchJooble({
    query: searchTerms,
    page: 1,
    pageSize: 50,
  });
  return jobs.find((job) => job.slug === slug) ?? null;
}
