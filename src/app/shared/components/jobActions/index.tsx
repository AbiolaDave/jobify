"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { applyToJob, getAuthSession, getMyApplications, reportJob } from "@/services/api";
import type { Job } from "@/types/jobs";

export default function JobActions({
  job,
  compact = false,
}: {
  job: Job;
  compact?: boolean;
}) {
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [requiresSignIn, setRequiresSignIn] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const applyDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let isMounted = true;
    getAuthSession()
      .then(({ authenticated, session }) =>
        authenticated && session?.role === "seeker" ? getMyApplications() : [],
      )
      .then((applications) => {
        if (isMounted) setHasApplied(applications.some((application) => application.jobId === job.id));
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setNotice(
            loadError instanceof Error
              ? loadError.message
              : "We couldn’t load your applications.",
          );
        }
      });
    return () => {
      isMounted = false;
    };
  }, [job.id]);

  async function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsApplying(true);
    setNotice("");
    setRequiresSignIn(false);
    setApplicationSubmitted(false);
    try {
      await applyToJob(job);
      setHasApplied(true);
      setApplicationSubmitted(true);
      applyDialog.current?.close();
      setIsApplyOpen(false);
      setNotice("Your application has been submitted.");
    } catch (error) {
      const apiError = error as Error & { status?: number };
      if (apiError.status === 401) setRequiresSignIn(true);
      setNotice(
        error instanceof Error
          ? error.message
          : "We could not send your application. Please try again.",
      );
    } finally {
      setIsApplying(false);
    }
  }

  function openApplyDialog() {
    setIsApplyOpen(true);
    window.requestAnimationFrame(() => applyDialog.current?.showModal());
  }

  function closeApplyDialog() {
    applyDialog.current?.close();
    setIsApplyOpen(false);
  }

  async function handleReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const reason = formData.get("reason");
    const details = formData.get("details");
    if (
      reason !== "scam" &&
      reason !== "incorrect" &&
      reason !== "discrimination" &&
      reason !== "other"
    ) {
      setNotice("Choose a reason before sending your report.");
      return;
    }

    try {
      await reportJob({
        jobId: job.id,
        reason,
        details: typeof details === "string" ? details : undefined,
      });
      setNotice("Thanks. Your report was recorded in this preview.");
      form.reset();
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "We could not send your report. Please try again.",
      );
    }
  }

  function shareOnWhatsApp() {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(
      `Check out this ${job.title} role at ${job.employer.name}: ${window.location.origin}/jobs/${job.slug}`,
    )}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={compact ? "job-actions job-actions--compact" : "job-actions"}>
      <button
        className="button-primary"
        disabled={isApplying || hasApplied}
        onClick={openApplyDialog}
        type="button"
      >
        {hasApplied ? "Applied" : "Apply on Jobify"}
      </button>
      <dialog
        aria-labelledby={`apply-title-${job.id}`}
        className="apply-dialog"
        onCancel={() => setIsApplyOpen(false)}
        ref={applyDialog}
      >
        {isApplyOpen && (
          <form className="apply-dialog-form" onSubmit={handleApply}>
            <p className="eyebrow">Jobify application</p>
            <h2 id={`apply-title-${job.id}`}>Apply for {job.title}</h2>
            <p className="muted-copy">
              {requiresSignIn
                ? "You need a Jobify account before applying."
                : "Review the role before you continue."}
            </p>
            {requiresSignIn && (
              <div className="badge-row">
                <Link className="button-secondary" href={`/login?next=${encodeURIComponent(`/jobs/${job.slug}`)}`}>
                  Sign in
                </Link>
                <Link className="button-secondary" href={`/sign-up?next=${encodeURIComponent(`/jobs/${job.slug}`)}`}>
                  Create account
                </Link>
              </div>
            )}
            <div className="badge-row">
              <button
                className="button-secondary"
                onClick={closeApplyDialog}
                type="button"
              >
                Cancel
              </button>
              <button
                className="button-primary"
                disabled={isApplying}
                type="submit"
              >
                {isApplying ? "Sending…" : "Confirm application"}
              </button>
            </div>
          </form>
        )}
      </dialog>
      {job.whatsappPhone && (
        <a
          className="button-secondary"
          href={`https://wa.me/${job.whatsappPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
            `Hi, I’m interested in the ${job.title} role at ${job.employer.name}.`,
          )}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Apply via WhatsApp
        </a>
      )}
      <button className="button-secondary" onClick={shareOnWhatsApp} type="button">
        Share on WhatsApp
      </button>
      <details className="report-details">
        <summary>Report this job</summary>
        <form className="report-form" onSubmit={handleReport}>
          <label htmlFor={`report-reason-${job.id}`}>Why are you reporting it?</label>
          <select
            className="filter-control"
            id={`report-reason-${job.id}`}
            name="reason"
            required
          >
            <option value="">Choose a reason</option>
            <option value="scam">Possible scam or payment request</option>
            <option value="incorrect">Incorrect or misleading details</option>
            <option value="discrimination">Discriminatory content</option>
            <option value="other">Something else</option>
          </select>
          <label htmlFor={`report-details-${job.id}`}>Additional details (optional)</label>
          <textarea
            className="filter-control"
            id={`report-details-${job.id}`}
            name="details"
            rows={3}
          />
          <button className="button-secondary" type="submit">
            Send report
          </button>
        </form>
      </details>
      {notice && (
        <p aria-live="polite" className="toast-message" role="status">
          {notice}
        </p>
      )}
      {applicationSubmitted && job.externalUrl && (
        <a href={job.externalUrl} rel="noreferrer noopener" target="_blank">
          Continue to the original listing
        </a>
      )}
    </div>
  );
}
