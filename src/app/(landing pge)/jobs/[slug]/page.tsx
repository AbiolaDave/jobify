import type { Metadata } from "next";
import { BadgeCheck, MapPin, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import JobActions from "@/app/shared/components/jobActions";
import JobCard from "@/app/shared/components/jobCard";
import { getJob, getJobs } from "@/services/jobs";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJob(slug);
  return {
    title: job ? `${job.title} at ${job.employer.name} | Jobify` : "Job not found | Jobify",
    description: job?.summary ?? "Browse trusted job opportunities on Jobify.",
  };
}

export default async function JobDetailsPage({ params }: Props) {
  const { slug } = await params;
  const job = await getJob(slug);
  if (!job) notFound();

  const { jobs } = await getJobs({ category: job.category, pageSize: 4 });
  const similarJobs = jobs.filter((similarJob) => similarJob.id !== job.id);
  const salary =
    job.salaryMin !== undefined && job.salaryMax !== undefined
      ? `${formatAmount(job.salaryMin)} – ${formatAmount(job.salaryMax)}`
      : job.salaryMin !== undefined || job.salaryMax !== undefined
        ? formatAmount(job.salaryMin ?? job.salaryMax ?? 0)
        : "Not listed";

  return (
    <main className="page-shell">
      <div className="details-back">
        <Link className="button-quiet" href="/jobs">
          ← Back to jobs
        </Link>
      </div>
      <div className="details-layout">
        <article className="details-main">
          <div className="details-employer">
            <span className="employer-mark" aria-hidden="true">
              {job.employer.initials}
            </span>
            <div>
              <p className="job-card-employer">{job.employer.name}</p>
              {job.employer.isVerified && (
                <span className="verified-badge">
                  <BadgeCheck size={15} aria-hidden="true" />
                  Verified employer
                </span>
              )}
            </div>
          </div>
          <h1 className="section-heading">{job.title}</h1>
          <p className="job-card-location">
            <MapPin size={17} aria-hidden="true" />
            {job.isRemote ? `Remote · ${job.state}` : `${job.city}, ${job.state}`}
          </p>
          <div className="badge-row">
            <span className="job-tag">{job.type}</span>
            <span className="job-tag">{job.level}</span>
            <span className="job-tag">{job.category}</span>
          </div>

          <section className="details-section">
            <h2>About this role</h2>
            <p className="muted-copy">{job.description}</p>
          </section>
          <section className="details-section">
            <h2>What you’ll bring</h2>
            <ul className="requirements-list">
              {job.requirements.map((requirement) => (
                <li key={requirement}>{requirement}</li>
              ))}
            </ul>
          </section>
          <section className="details-section">
            <h2>About the employer</h2>
            <p className="muted-copy">
              {job.employer.name} · {job.employer.industry} ·{" "}
              {job.employer.location}
            </p>
          </section>
        </article>

        <aside className="details-sidebar">
          <div className="details-apply-card">
            <p className="eyebrow">Compensation</p>
            <p className="details-salary">
              {salary}
              {job.salaryPeriod === "monthly" ? " / month" : ""}
            </p>
            <JobActions job={job} />
            <p className="safety-note safety-note--light">
              <ShieldCheck size={20} aria-hidden="true" />
              <span>
                <strong>Never pay to get a job.</strong> Report anyone asking
                for money.
              </span>
            </p>
          </div>
        </aside>
      </div>

      {similarJobs.length > 0 && (
        <section className="section-block">
          <p className="eyebrow">Keep exploring</p>
          <h2 className="section-heading">Similar opportunities</h2>
          <div className="job-grid">
            {similarJobs.slice(0, 3).map((similarJob) => (
              <JobCard job={similarJob} key={similarJob.id} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}
