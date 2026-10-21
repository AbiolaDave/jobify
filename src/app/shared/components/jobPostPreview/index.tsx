import type { CreateJobInput } from "@/types/platform";

export default function JobPostPreview({
  preview,
}: {
  preview: CreateJobInput | null;
}) {
  return (
    <aside className="post-preview">
      <p className="eyebrow">{preview ? "Preview" : "Good posts get noticed"}</p>
      {preview ? (
        <>
          <h2>{preview.title || "Your job title"}</h2>
          <p className="muted-copy">
            {preview.city || "City"}, {preview.state || "State"}
            {preview.isRemote ? " · Remote" : ""}
          </p>
          <div className="badge-row">
            <span className="job-tag">{preview.type}</span>
            <span className="job-tag">{preview.level}</span>
          </div>
          <p>{preview.summary || "Your short summary will appear here."}</p>
          <h3>What you’ll do</h3>
          <p className="muted-copy">
            {preview.description || "Add a clear description of the role."}
          </p>
        </>
      ) : (
        <ul className="requirements-list">
          <li>Write a clear title and role summary.</li>
          <li>Be transparent about responsibilities and pay.</li>
          <li>Never ask a candidate to pay to apply.</li>
        </ul>
      )}
    </aside>
  );
}
