import { nigerianStates } from "@/data/nigerianStates";

export default function JobLocationFields() {
  return (
    <fieldset className="form-section">
      <legend>Location and pay</legend>
      <div className="form-grid">
        <label className="filter-group" htmlFor="job-state">
          State
          <select className="filter-control" id="job-state" name="state" required>
            {nigerianStates.map((state) => (
              <option key={state} value={state}>
                {state === "FCT" ? "Abuja (FCT)" : state}
              </option>
            ))}
          </select>
        </label>
        <label className="filter-group" htmlFor="job-city">
          City or LGA
          <input
            className="filter-control"
            id="job-city"
            name="city"
            placeholder="e.g. Ikeja"
            required
          />
        </label>
        <label className="filter-check form-grid-wide">
          <input name="isRemote" type="checkbox" />
          This role can be done remotely
        </label>
        <label className="filter-group" htmlFor="salary-min">
          Minimum pay (₦)
          <input
            className="filter-control"
            id="salary-min"
            min="0"
            name="salaryMin"
            type="number"
          />
        </label>
        <label className="filter-group" htmlFor="salary-max">
          Maximum pay (₦)
          <input
            className="filter-control"
            id="salary-max"
            min="0"
            name="salaryMax"
            type="number"
          />
        </label>
        <label className="filter-group" htmlFor="salary-period">
          Pay period
          <select
            className="filter-control"
            defaultValue="monthly"
            id="salary-period"
            name="salaryPeriod"
          >
            <option value="monthly">Per month</option>
            <option value="yearly">Per year</option>
          </select>
        </label>
      </div>
    </fieldset>
  );
}
