"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyJobs } from "@/services/api";
import type { Job } from "@/types/jobs";

export default function EmployerDashboardPage() {
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
              : "We couldn’t load your jobs.",
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
          <p className="eyebrow">For employers</p>
          <h1 className="section-heading">Build your team with Jobify.</h1>
          <p className="muted-copy">
            Reach Nigeria’s next generation of graduates, NYSC corps members,
            and freelancers.
          </p>
        </div>
        <Link className="button-primary" href="/dashboard/employer/post-job">
          Post a job
        </Link>
      </div>

      {error && (
        <p aria-live="assertive" className="auth-message auth-message--error" role="alert">
          {error}
        </p>
      )}
      <section className="dashboard-stats" aria-label="Employer activity">
        <article className="dashboard-stat-card">
          <span className="eyebrow">Your jobs</span>
          <strong>{isLoading ? "—" : jobs.length}</strong>
          <Link href="/dashboard/employer/jobs">View your postings</Link>
        </article>
        <article className="dashboard-stat-card">
          <span className="eyebrow">Ready to hire?</span>
          <strong>60 sec</strong>
          <Link href="/dashboard/employer/post-job">Create a job post</Link>
        </article>
      </section>
      <section className="dashboard-cta">
        <div>
          <h2>Keep hiring straightforward.</h2>
          <p className="muted-copy">
            Be clear about the work, pay, and expectations. Never ask candidates
            to pay to apply.
          </p>
        </div>
        <Link className="button-secondary" href="/dashboard/employer/post-job">
          Create your first post
        </Link>
      </section>
    </main>
  );
}
