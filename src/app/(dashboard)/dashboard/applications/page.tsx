"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyApplications } from "@/services/api";
import type { JobApplication } from "@/types/platform";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    getMyApplications()
      .then((result) => {
        if (isMounted) setApplications(result);
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn’t load your applications.",
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
          <p className="eyebrow">Your job search</p>
          <h1 className="section-heading">My applications</h1>
          <p className="muted-copy">
            Follow your applications from sent to shortlisted.
          </p>
        </div>
        <Link className="button-primary" href="/jobs">
          Find more jobs
        </Link>
      </div>

      {error && (
        <p aria-live="assertive" className="auth-message auth-message--error" role="alert">
          {error}
        </p>
      )}
      {isLoading ? (
        <div aria-busy="true" className="skeleton" />
      ) : applications.length ? (
        <div className="application-list">
          {applications.map((application) => (
            <article className="application-row" key={application.id}>
              <div>
                <h2>
                  <Link href={`/jobs/${application.jobSlug}`}>
                    {application.jobTitle}
                  </Link>
                </h2>
                <p className="muted-copy">{application.employerName}</p>
                <p className="muted-copy">
                  Applied{" "}
                  {new Date(application.appliedAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span
                className={`status-badge status-badge--${application.status.toLowerCase()}`}
              >
                {application.status}
              </span>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No applications yet</h2>
          <p className="muted-copy">
            Once you apply for a role, you can keep track of its progress here.
          </p>
          <Link className="button-primary" href="/jobs">
            Browse jobs
          </Link>
        </div>
      )}
    </main>
  );
}
