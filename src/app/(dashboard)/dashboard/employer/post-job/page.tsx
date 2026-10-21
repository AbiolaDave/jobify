"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import JobBasicsFields from "@/app/shared/components/jobBasicsFields";
import JobDescriptionFields from "@/app/shared/components/jobDescriptionFields";
import JobLocationFields from "@/app/shared/components/jobLocationFields";
import JobPostPreview from "@/app/shared/components/jobPostPreview";
import { employmentTypes, experienceLevels } from "@/data/jobOptions";
import { createJob } from "@/services/api";
import type { EmploymentType, ExperienceLevel, Job } from "@/types/jobs";
import type { CreateJobInput } from "@/types/platform";

export default function PostJobPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<CreateJobInput | null>(null);
  const [createdJob, setCreatedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function readForm(): CreateJobInput | null {
    const form = formRef.current;
    if (!form) return null;
    if (!form.reportValidity()) return null;
    const values = new FormData(form);
    const type = String(values.get("type"));
    const level = String(values.get("level"));
    const requirements = String(values.get("requirements") ?? "")
      .split(/\r?\n/)
      .map((requirement) => requirement.trim())
      .filter(Boolean);
    const salaryMin = optionalAmount(String(values.get("salaryMin") ?? ""));
    const salaryMax = optionalAmount(String(values.get("salaryMax") ?? ""));
    const whatsappRaw = String(values.get("whatsappPhone") ?? "");
    const whatsappPhone = normalizePhone(whatsappRaw);
    if (salaryMin !== undefined && salaryMax !== undefined && salaryMin > salaryMax) {
      setError("Minimum pay can’t be greater than maximum pay.");
      return null;
    }
    if (whatsappRaw.trim() && !whatsappPhone) {
      setError("Enter a valid WhatsApp number in +234 format.");
      return null;
    }
    if (
      !employmentTypes.some((item) => item === type) ||
      !experienceLevels.some((item) => item === level)
    ) {
      setError("Choose a valid job type and experience level.");
      return null;
    }

    setError("");
    return {
      title: String(values.get("title") ?? "").trim(),
      state: String(values.get("state") ?? ""),
      city: String(values.get("city") ?? "").trim(),
      isRemote: values.get("isRemote") === "on",
      type: type as EmploymentType,
      level: level as ExperienceLevel,
      category: String(values.get("category") ?? ""),
      salaryMin,
      salaryMax,
      salaryPeriod: values.get("salaryPeriod") === "yearly" ? "yearly" : "monthly",
      summary: String(values.get("summary") ?? "").trim(),
      description: String(values.get("description") ?? "").trim(),
      requirements,
      whatsappPhone,
    };
  }

  function showPreview() {
    const values = readForm();
    if (values) setPreview(values);
  }

  async function submitJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const values = readForm();
      if (!values) return;
      const job = await createJob(values);
      setCreatedJob(job);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn’t post your job. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (createdJob) {
    return (
      <main className="page-shell dashboard-content">
        <div className="empty-state">
          <p className="eyebrow">Draft created</p>
          <h1 className="section-heading">Your job post is ready.</h1>
          <p className="muted-copy">
            It has been saved in this browser preview. Connect the employer
            endpoint to publish it for real.
          </p>
          <div className="badge-row">
            <Link className="button-primary" href="/dashboard/employer/jobs">
              View my jobs
            </Link>
            <span className="job-tag">{createdJob.title}</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell dashboard-content">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Fast, fair hiring</p>
          <h1 className="section-heading">Post a job</h1>
          <p className="muted-copy">
            Share the essentials. Clear pay and expectations help candidates
            decide if a role is right for them.
          </p>
        </div>
        <Link className="button-quiet" href="/dashboard/employer">
          ← Employer dashboard
        </Link>
      </div>

      <div className="post-job-layout">
        <form className="profile-form" onSubmit={submitJob} ref={formRef}>
          <JobBasicsFields />
          <JobLocationFields />
          <JobDescriptionFields />

          {error && (
            <p aria-live="assertive" className="auth-message auth-message--error" role="alert">
              {error}
            </p>
          )}
          <div className="badge-row">
            <button className="button-secondary" onClick={showPreview} type="button">
              Preview post
            </button>
            <button className="button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving…" : "Create job post"}
            </button>
          </div>
        </form>

        <JobPostPreview preview={preview} />
      </div>
    </main>
  );
}

function optionalAmount(value: string): number | undefined {
  if (!value) return undefined;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : undefined;
}

function normalizePhone(value: string): string | undefined {
  if (!value.trim()) return undefined;
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("234")
    ? digits.slice(3)
    : digits.startsWith("0")
      ? digits.slice(1)
      : digits;
  return /^\d{10}$/.test(local) ? `+234${local}` : undefined;
}
