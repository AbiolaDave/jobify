import { BadgeCheck, MapPin } from "lucide-react";
import Link from "next/link";
import type { Job } from "@/types/jobs";
import JobActions from "@/app/shared/components/jobActions";
import SaveJobButton from "@/app/shared/components/saveJobButton";

function formatSalary(job: Job): string {
  if (job.salaryMin === undefined && job.salaryMax === undefined) {
    return "Salary not listed";
  }

  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amount);

  const range =
    job.salaryMin !== undefined && job.salaryMax !== undefined
      ? `${formatAmount(job.salaryMin)} – ${formatAmount(job.salaryMax)}`
      : formatAmount(job.salaryMin ?? job.salaryMax ?? 0);

  return `${range}${job.salaryPeriod === "monthly" ? " / month" : ""}`;
}

export default function JobCard({
  job,
  initiallySaved = false,
  onSavedChange,
}: {
  job: Job;
  initiallySaved?: boolean;
  onSavedChange?: (isSaved: boolean) => void;
}) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="employer-mark" aria-hidden="true">
          {job.employer.initials}
        </div>
        <div className="job-card-badges">
          {job.employer.isVerified && (
            <span className="verified-badge">
              <BadgeCheck size={15} aria-hidden="true" />
              Verified employer
            </span>
          )}
          <SaveJobButton
            initiallySaved={initiallySaved}
            jobId={job.id}
            onSavedChange={onSavedChange}
          />
        </div>
      </div>

      <div>
        <h3 className="job-card-title">
          <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
        </h3>
        <p className="job-card-employer">{job.employer.name}</p>
      </div>

      <p className="job-card-location">
        <MapPin size={16} aria-hidden="true" />
        {job.isRemote ? `Remote · ${job.state}` : `${job.city}, ${job.state}`}
      </p>
      <p className="job-card-summary">{job.summary}</p>

      <div className="badge-row">
        <span className="job-tag">{job.type}</span>
        <span className="job-tag">{job.level}</span>
        {job.isRemote && <span className="job-tag--accent job-tag">Remote</span>}
      </div>

      <div className="job-card-footer">
        <span className="job-card-salary">{formatSalary(job)}</span>
        <Link className="button-quiet" href={`/jobs/${job.slug}`}>
          View role <span aria-hidden="true">→</span>
        </Link>
      </div>
      <JobActions compact job={job} />
    </article>
  );
}
