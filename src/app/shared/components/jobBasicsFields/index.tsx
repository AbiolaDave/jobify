import { employmentTypes, experienceLevels, jobCategories } from "@/data/jobOptions";

export default function JobBasicsFields() {
  return (
    <fieldset className="form-section">
      <legend>The role</legend>
      <div className="form-grid">
        <label className="filter-group form-grid-wide" htmlFor="job-title">
          Job title
          <input
            className="filter-control"
            id="job-title"
            maxLength={100}
            name="title"
            placeholder="e.g. Junior Product Designer"
            required
          />
        </label>
        <label className="filter-group" htmlFor="job-type">
          Job type
          <select className="filter-control" id="job-type" name="type" required>
            {employmentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-group" htmlFor="job-level">
          Experience level
          <select className="filter-control" id="job-level" name="level" required>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-group" htmlFor="job-category">
          Category
          <select
            className="filter-control"
            id="job-category"
            name="category"
            required
          >
            {jobCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>
    </fieldset>
  );
}
