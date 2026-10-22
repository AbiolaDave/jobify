"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyJobs } from "@/services/api";
import type { Job } from "@/types/jobs";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getMyJobs()
      .then((result) => {
        if (isMounted) setJobs(result);
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn’t load your job posts.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page-shell dashboard-content">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Your hiring workspace</p>
          <h1 className="section-heading">My job posts</h1>
        </div>
        <Link className="button-primary" href="/dashboard/employer/post-job">
          Post a job
        </Link>
      </div>
      {error && (
        <p
          aria-live="assertive"
          className="auth-message auth-message--error"
          role="alert"
        >
          {error}
        </p>
      )}
      {isLoading ? (
        <div aria-busy="true" className="job-grid">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : jobs.length ? (
        <div className="job-grid">
          {jobs.map((job) => (
            <article className="job-card" key={job.id}>
              <div className="job-card-top">
                <span className="eyebrow">Published job</span>
                <span className="job-tag job-tag--accent">Live</span>
              </div>
              <h2 className="job-card-title">{job.title}</h2>
              <p className="job-card-location">
                {job.isRemote
                  ? `Remote · ${job.state}`
                  : `${job.city}, ${job.state}`}
              </p>
              <p className="job-card-summary">{job.summary}</p>
              <div className="badge-row">
                <span className="job-tag">{job.type}</span>
                <span className="job-tag">{job.level}</span>
              </div>
              <Link
                className="button-secondary"
                href={`/dashboard/employer/jobs/${job.id}/applicants`}
              >
                View applicants
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No job posts yet</h2>
          <p className="muted-copy">
            Create a clear, welcoming post to meet your next teammate.
          </p>
          <Link className="button-primary" href="/dashboard/employer/post-job">
            Create a job post
          </Link>
        </div>
      )}
    </main>
  );
}
