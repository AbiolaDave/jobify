"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApplicants, updateApplicationStatus } from "@/services/api";
import type { Applicant } from "@/types/platform";
import type { ApplicationStatus } from "@/types/jobs";

export default function ApplicantsPanel({ jobId }: { jobId: string }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    let isMounted = true;
    getApplicants(jobId)
      .then((result) => {
        if (isMounted) setApplicants(result);
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn’t load applicants.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [jobId]);

  async function updateStatus(applicationId: string, status: ApplicationStatus) {
    setUpdatingId(applicationId);
    setError("");
    try {
      await updateApplicationStatus({ applicationId, status });
      setApplicants((current) =>
        current.map((applicant) =>
          applicant.application.id === applicationId
            ? {
                ...applicant,
                application: { ...applicant.application, status },
              }
            : applicant,
        ),
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "We couldn’t update this application. Please try again.",
      );
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <main className="page-shell dashboard-content">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Hiring workspace</p>
          <h1 className="section-heading">Applicants</h1>
          <p className="muted-copy">
            Review candidates fairly and keep them updated as you decide.
          </p>
        </div>
        <Link className="button-quiet" href="/dashboard/employer/jobs">
          ← My job posts
        </Link>
      </div>
      {error && (
        <p aria-live="assertive" className="auth-message auth-message--error" role="alert">
          {error}
        </p>
      )}
      {isLoading ? (
        <div aria-busy="true" className="skeleton" />
      ) : applicants.length ? (
        <div className="applicant-list">
          {applicants.map(({ application, seeker }) => (
            <article className="applicant-card" key={application.id}>
              <div>
                <h2>{seeker.fullName}</h2>
                <p className="muted-copy">{seeker.headline}</p>
                <p className="muted-copy">
                  Skills: {seeker.skills.length ? seeker.skills.join(", ") : "Not listed"}
                </p>
                <span
                  className={`status-badge status-badge--${application.status.toLowerCase()}`}
                >
                  {application.status}
                </span>
              </div>
              <div className="badge-row">
                {seeker.cvUrl && (
                  <a
                    className="button-secondary"
                    href={seeker.cvUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View CV
                  </a>
                )}
                <button
                  className="button-secondary"
                  disabled={updatingId === application.id}
                  onClick={() =>
                    void updateStatus(application.id, "Shortlisted")
                  }
                  type="button"
                >
                  Shortlist
                </button>
                <button
                  className="button-quiet"
                  disabled={updatingId === application.id}
                  onClick={() => void updateStatus(application.id, "Rejected")}
                  type="button"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No applications to review yet</h2>
          <p className="muted-copy">
            When someone applies to this job, their application will appear here.
          </p>
        </div>
      )}
    </main>
  );
}
