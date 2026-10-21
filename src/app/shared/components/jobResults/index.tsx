import { BriefcaseBusiness } from "lucide-react";
import Link from "next/link";
import JobCard from "@/app/shared/components/jobCard";
import type { JobFilters, JobSearchResult } from "@/types/jobs";

export default function JobResults({
  filters,
  result,
}: {
  filters: JobFilters;
  result: JobSearchResult;
}) {
  const queryParams = toSearchParams(filters);

  return (
    <section aria-label="Job search results">
      {result.warning && (
        <p aria-live="polite" className="auth-message" role="status">
          {result.warning}
        </p>
      )}
      <div className="results-toolbar">
        <div>
          <p className="result-count">
            {result.total} {result.total === 1 ? "opportunity" : "opportunities"}
          </p>
          {filters.query && (
            <p className="muted-copy">Results for “{filters.query}”</p>
          )}
        </div>
        <form action="/jobs" method="get">
          {Array.from(queryParams.entries()).map(([key, value]) => (
            <input key={key} name={key} type="hidden" value={value} />
          ))}
          <label htmlFor="sort">Sort:</label>
          <select
            className="filter-control"
            defaultValue={filters.sort ?? "newest"}
            id="sort"
            name="sort"
          >
            <option value="newest">Newest</option>
            <option value="salary">Salary: highest first</option>
          </select>
          <button className="button-secondary" type="submit">
            Sort
          </button>
        </form>
      </div>

      {result.jobs.length > 0 ? (
        <div className="job-grid">
          {result.jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BriefcaseBusiness
            aria-hidden="true"
            color="var(--color-green-dark)"
            size={32}
          />
          <h2>No matching jobs just yet</h2>
          <p className="muted-copy">
            Try a different keyword or remove a filter to see more opportunities.
          </p>
          <Link className="button-primary" href="/jobs">
            See all jobs
          </Link>
        </div>
      )}

      {result.totalPages > 1 && (
        <nav aria-label="Pagination" className="pagination">
          {result.page > 1 && (
            <Link
              className="button-secondary"
              href={paginationHref(queryParams, result.page - 1)}
            >
              Previous
            </Link>
          )}
          <span>
            Page {result.page} of {result.totalPages}
          </span>
          {result.page < result.totalPages && (
            <Link
              className="button-secondary"
              href={paginationHref(queryParams, result.page + 1)}
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </section>
  );
}

function paginationHref(params: URLSearchParams, page: number): string {
  const next = new URLSearchParams(params);
  next.set("page", String(page));
  return `/jobs?${next.toString()}`;
}

function toSearchParams(filters: JobFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query) params.set("query", filters.query);
  if (filters.state) params.set("state", filters.state);
  if (filters.remote) params.set("remote", "true");
  if (filters.type) params.set("type", filters.type);
  if (filters.level) params.set("level", filters.level);
  if (filters.category) params.set("category", filters.category);
  if (filters.minSalary !== undefined)
    params.set("minSalary", String(filters.minSalary));
  if (filters.maxSalary !== undefined)
    params.set("maxSalary", String(filters.maxSalary));
  if (filters.sort && filters.sort !== "newest")
    params.set("sort", filters.sort);
  return params;
}
