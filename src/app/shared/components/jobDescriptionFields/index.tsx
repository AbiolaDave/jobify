export default function JobDescriptionFields() {
  return (
    <fieldset className="form-section">
      <legend>Tell candidates about the work</legend>
      <div className="form-grid">
        <label className="filter-group form-grid-wide" htmlFor="job-summary">
          Short summary
          <textarea
            className="filter-control"
            id="job-summary"
            maxLength={220}
            name="summary"
            required
            rows={2}
          />
        </label>
        <label className="filter-group form-grid-wide" htmlFor="job-description">
          Role description
          <textarea
            className="filter-control"
            id="job-description"
            name="description"
            required
            rows={5}
          />
        </label>
        <label className="filter-group form-grid-wide" htmlFor="job-requirements">
          Requirements (one per line)
          <textarea
            className="filter-control"
            id="job-requirements"
            name="requirements"
            required
            rows={4}
          />
        </label>
        <label className="filter-group form-grid-wide" htmlFor="job-whatsapp">
          WhatsApp contact (optional, +234)
          <input
            className="filter-control"
            id="job-whatsapp"
            inputMode="tel"
            name="whatsappPhone"
            placeholder="+234 801 234 5678"
            type="tel"
          />
        </label>
      </div>
    </fieldset>
  );
}
