import "server-only";
import { connectToDatabase } from "@/lib/db";
import JobPost, { type JobPostRecord } from "@/models/JobPost";
import { getAllMockJobs } from "@/services/mockJobs";
import type { Job, JobFilters, JobSearchResult } from "@/types/jobs";

function mapPost(post: JobPostRecord): Job {
  const employerName = post.employerName;
  return {
    id: post._id.toString(),
    slug: post.slug,
    title: post.title,
    employer: {
      id: post.employerId.toString(),
      name: employerName,
      initials: employerName
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase(),
      industry: post.industry,
      isVerified: false,
      location: `${post.city}, ${post.state}`,
    },
    state: post.state,
    city: post.city,
    isRemote: post.isRemote,
    type: post.type,
    level: post.level,
    category: post.category,
    ...(typeof post.salaryMin === "number"
      ? { salaryMin: post.salaryMin }
      : {}),
    ...(typeof post.salaryMax === "number"
      ? { salaryMax: post.salaryMax }
      : {}),
    salaryPeriod: post.salaryPeriod,
    summary: post.summary,
    description: post.description,
    requirements: post.requirements,
    postedAt: new Date(post.postedAt).toISOString().slice(0, 10),
    isFeatured: false,
    ...(post.whatsappPhone ? { whatsappPhone: post.whatsappPhone } : {}),
  };
}

async function getPublishedJobs(): Promise<Job[]> {
  try {
    await connectToDatabase();
    const posts = await JobPost.find({ status: "published" })
      .sort({ postedAt: -1 })
      .lean();
    return posts.map((post) => mapPost(post as JobPostRecord));
  } catch (error) {
    console.error("Unable to load employer job posts:", error);
    return [];
  }
}

export async function getJobs(
  filters: JobFilters = {},
): Promise<JobSearchResult> {
  const allJobs = [...(await getPublishedJobs()), ...getAllMockJobs()];
  const query = filters.query?.trim().toLowerCase();
  const filtered = allJobs.filter((job) => {
    const searchableText = [
      job.title,
      job.employer.name,
      job.summary,
      job.category,
      job.city,
      job.state,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchableText.includes(query)) &&
      (!filters.state ||
        (filters.state.toLowerCase() === "remote"
          ? job.isRemote
          : job.state.toLowerCase() === filters.state.toLowerCase())) &&
      (!filters.remote || job.isRemote) &&
      (!filters.type || job.type === filters.type) &&
      (!filters.level || job.level === filters.level) &&
      (!filters.category ||
        job.category.toLowerCase() === filters.category.toLowerCase()) &&
      (filters.minSalary === undefined ||
        (job.salaryMax !== undefined && job.salaryMax >= filters.minSalary)) &&
      (filters.maxSalary === undefined ||
        (job.salaryMin !== undefined && job.salaryMin <= filters.maxSalary))
    );
  });

  if (filters.sort === "salary") {
    filtered.sort(
      (first, second) => (second.salaryMax ?? 0) - (first.salaryMax ?? 0),
    );
  } else {
    filtered.sort((first, second) =>
      second.postedAt.localeCompare(first.postedAt),
    );
  }

  const pageSize = Math.max(1, filters.pageSize ?? 6);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filters.page ?? 1), totalPages);
  const start = (page - 1) * pageSize;

  return {
    jobs: filtered.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getFeaturedJobs(limit = 3): Promise<{ jobs: Job[] }> {
  const { jobs } = await getJobs({ pageSize: 100 });
  const featured = jobs.filter((job) => job.isFeatured);
  return { jobs: featured.slice(0, limit) };
}

export async function getJob(slug: string): Promise<Job | null> {
  const { jobs } = await getJobs({ pageSize: Number.MAX_SAFE_INTEGER });
  return jobs.find((job) => job.slug === slug) ?? null;
}
