"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getMyApplications, getSavedJobs, getSeekerProfile } from "@/services/api";
import type { JobApplication, Seeker } from "@/types/platform";
import type { Job } from "@/types/jobs";

export default function DashboardPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [profile, setProfile] = useState<Seeker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadDashboard() {
      try {
        const [applicationList, savedJobList, seekerProfile] = await Promise.all([
          getMyApplications(),
          getSavedJobs(),
          getSeekerProfile(),
        ]);
        if (isMounted) {
          setApplications(applicationList);
          setSavedJobs(savedJobList);
          setProfile(seekerProfile);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn’t load your dashboard.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="page-shell dashboard-content">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Your Jobify workspace</p>
          <h1 className="section-heading">
            {profile?.fullName ? `Welcome, ${profile.fullName.split(" ")[0]}` : "Welcome to Jobify"}
          </h1>
          <p className="muted-copy">
            Keep your job search moving, one step at a time.
          </p>
        </div>
        <Link className="button-primary" href="/jobs">
          Browse jobs
        </Link>
      </div>

      {error && (
        <p aria-live="assertive" className="auth-message auth-message--error" role="alert">
          {error}
        </p>
      )}

      <section aria-label="Your activity" className="dashboard-stats">
        <article className="dashboard-stat-card">
          <span className="eyebrow">Applications</span>
          <strong>{isLoading ? "—" : applications.length}</strong>
          <Link href="/dashboard/applications">Track your applications</Link>
        </article>
        <article className="dashboard-stat-card">
          <span className="eyebrow">Saved jobs</span>
          <strong>{isLoading ? "—" : savedJobs.length}</strong>
          <Link href="/dashboard/saved-jobs">Review your saved roles</Link>
        </article>
        <article className="dashboard-stat-card">
          <span className="eyebrow">Profile complete</span>
          <strong>{isLoading ? "—" : `${profile?.profileCompleteness ?? 0}%`}</strong>
          <Link href="/dashboard/profile">Improve your profile</Link>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="results-toolbar">
          <div>
            <p className="eyebrow">Keep going</p>
            <h2 className="section-heading">Your recent applications</h2>
          </div>
          <Link className="button-quiet" href="/dashboard/applications">
            View all
          </Link>
        </div>
        {isLoading ? (
          <div aria-busy="true" className="skeleton" />
        ) : applications.length ? (
          <div className="application-list">
            {applications.slice(0, 3).map((application) => (
              <ApplicationRow application={application} key={application.id} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>Your next opportunity is out there.</h3>
            <p className="muted-copy">
              Explore trusted jobs and apply when you find the right fit.
            </p>
            <Link className="button-primary" href="/jobs">
              Explore jobs
            </Link>
          </div>
        )}
      </section>

      <section className="dashboard-cta">
        <div>
          <p className="eyebrow">Hiring junior talent?</p>
          <h2>Find your next great teammate.</h2>
          <p className="muted-copy">
            Post a role for graduates, NYSC corps members, and freelancers.
          </p>
        </div>
        <Link className="button-secondary" href="/dashboard/employer/post-job">
          Post a job
        </Link>
      </section>
    </main>
  );
}

function ApplicationRow({ application }: { application: JobApplication }) {
  return (
    <article className="application-row">
      <div>
        <h3>{application.jobTitle}</h3>
        <p className="muted-copy">{application.employerName}</p>
      </div>
      <span className={`status-badge status-badge--${application.status.toLowerCase()}`}>
        {application.status}
      </span>
    </article>
  );
}
