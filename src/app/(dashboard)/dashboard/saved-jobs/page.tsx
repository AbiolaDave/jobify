"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JobCard from "@/app/shared/components/jobCard";
import { getSavedJobs } from "@/services/api";
import type { Job } from "@/types/jobs";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getSavedJobs()
      .then((result) => {
        if (isMounted) setJobs(result);
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn’t load your saved jobs.",
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
          <p className="eyebrow">Keep a shortlist</p>
          <h1 className="section-heading">Saved jobs</h1>
          <p className="muted-copy">
            Keep the roles you want to come back to in one place.
          </p>
        </div>
        <Link className="button-primary" href="/jobs">
          Explore jobs
        </Link>
      </div>

      {error && (
        <p aria-live="assertive" className="auth-message auth-message--error" role="alert">
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
            <JobCard
              initiallySaved
              job={job}
              key={job.id}
              onSavedChange={(isSaved) => {
                if (!isSaved) {
                  setJobs((current) =>
                    current.filter((savedJob) => savedJob.id !== job.id),
                  );
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No saved jobs yet</h2>
          <p className="muted-copy">
            Tap “Save job” on any opportunity to add it to your shortlist.
          </p>
          <Link className="button-primary" href="/jobs">
            Find a job
          </Link>
        </div>
      )}
    </main>
  );
}
