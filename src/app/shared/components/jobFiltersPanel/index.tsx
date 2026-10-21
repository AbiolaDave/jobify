import Link from "next/link";
import {
  employmentTypes,
  experienceLevels,
  jobCategories,
} from "@/data/jobOptions";
import { nigerianStates } from "@/data/nigerianStates";
import type { JobFilters } from "@/types/jobs";

export default function JobFiltersPanel({
  filters,
}: {
  filters: JobFilters;
}) {
  return (
    <form action="/jobs" className="filter-panel" method="get">
      <h2>Refine your search</h2>
      <div className="filter-group">
        <label htmlFor="query">Keyword</label>
        <input
          className="filter-control"
          defaultValue={filters.query}
          id="query"
          name="query"
          placeholder="Title, skill, company"
          type="search"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="state">State or location</label>
        <select
          className="filter-control"
          defaultValue={filters.state}
          id="state"
          name="state"
        >
          <option value="">All Nigeria</option>
          <option value="Remote">Remote</option>
          {nigerianStates.map((state) => (
            <option key={state} value={state}>
              {state === "FCT" ? "Abuja (FCT)" : state}
            </option>
          ))}
        </select>
      </div>
      <label className="filter-check">
        <input
          defaultChecked={filters.remote}
          name="remote"
          type="checkbox"
          value="true"
        />
        Include remote jobs only
      </label>
      <div className="filter-group">
        <label htmlFor="type">Job type</label>
        <select
          className="filter-control"
          defaultValue={filters.type ?? ""}
          id="type"
          name="type"
        >
          <option value="">Any type</option>
          {employmentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="level">Experience level</label>
        <select
          className="filter-control"
          defaultValue={filters.level ?? ""}
          id="level"
          name="level"
        >
          <option value="">Any level</option>
          {experienceLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          className="filter-control"
          defaultValue={filters.category ?? ""}
          id="category"
          name="category"
        >
          <option value="">Any category</option>
          {jobCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="minSalary">Minimum salary (₦)</label>
        <input
          className="filter-control"
          defaultValue={filters.minSalary}
          id="minSalary"
          min="0"
          name="minSalary"
          placeholder="e.g. 150000"
          type="number"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="maxSalary">Maximum salary (₦)</label>
        <input
          className="filter-control"
          defaultValue={filters.maxSalary}
          id="maxSalary"
          min="0"
          name="maxSalary"
          placeholder="e.g. 500000"
          type="number"
        />
      </div>
      <button className="button-primary" type="submit">
        Apply filters
      </button>
      <Link className="button-quiet" href="/jobs">
        Clear filters
      </Link>
    </form>
  );
}
