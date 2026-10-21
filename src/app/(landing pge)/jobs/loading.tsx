export default function JobsLoading() {
  return (
    <main aria-busy="true" aria-label="Loading job listings" className="page-shell">
      <div className="listing-heading">
        <p className="eyebrow">Finding your next step</p>
        <h1>Loading opportunities…</h1>
      </div>
      <div className="job-grid">
        {Array.from({ length: 3 }, (_, index) => (
          <div className="skeleton" key={index} />
        ))}
      </div>
    </main>
  );
}
