import type { Metadata } from "next";
import JobFiltersPanel from "@/app/shared/components/jobFiltersPanel";
import JobResults from "@/app/shared/components/jobResults";
import {
  employmentTypes,
  experienceLevels,
  jobCategories,
} from "@/data/jobOptions";
import { getJobs } from "@/services/jobs";
import type { EmploymentType, ExperienceLevel, JobFilters } from "@/types/jobs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Find a job | Jobify",
  description:
    "Search verified early-career jobs, internships, and freelance opportunities across Nigeria.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

function numberValue(value: string): number | undefined {
  const number = Number(value);
  return value && Number.isFinite(number) && number >= 0 ? number : undefined;
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const typeParam = firstValue(params.type);
  const levelParam = firstValue(params.level);
  const stateParam = firstValue(params.state);
  const filters: JobFilters = {
    query: firstValue(params.query),
    state: stateParam,
    remote:
      firstValue(params.remote) === "true" ||
      firstValue(params.remote) === "on" ||
      stateParam.toLowerCase() === "remote",
    type: employmentTypes.find(
      (type): type is EmploymentType => type === typeParam,
    ),
    level: experienceLevels.find(
      (level): level is ExperienceLevel => level === levelParam,
    ),
    category: jobCategories.find(
      (category) =>
        category.toLowerCase() === firstValue(params.category).toLowerCase(),
    ),
    minSalary: numberValue(firstValue(params.minSalary)),
    maxSalary: numberValue(firstValue(params.maxSalary)),
    sort: firstValue(params.sort) === "salary" ? "salary" : "newest",
    page: numberValue(firstValue(params.page)) ?? 1,
    pageSize: 4,
  };
  const result = await getJobs(filters);

  return (
    <main className="page-shell">
      <div className="listing-heading">
        <p className="eyebrow">The next step starts here</p>
        <h1>Find work that moves you forward.</h1>
        <p className="muted-copy">
          Opportunities for students, graduates, NYSC corps members, and
          early-career talent across Nigeria.
        </p>
      </div>
      <div className="listing-form">
        <div className="listing-layout">
          <JobFiltersPanel filters={filters} />
          <JobResults filters={filters} result={result} />
        </div>
      </div>
    </main>
  );
}
