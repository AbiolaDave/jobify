"use client";

import { useEffect, useState } from "react";
import { getSavedJobs, saveJob, unsaveJob } from "@/services/api";

export default function SaveJobButton({
  jobId,
  initiallySaved = false,
  onSavedChange,
}: {
  jobId: string;
  initiallySaved?: boolean;
  onSavedChange?: (isSaved: boolean) => void;
}) {
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initiallySaved) return;
    let isMounted = true;
    getSavedJobs()
      .then((jobs) => {
        if (isMounted) {
          setIsSaved(jobs.some((job) => job.id === jobId));
        }
      })
      .catch((loadError: unknown) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "We couldn’t load saved jobs.",
          );
        }
      });
    return () => {
      isMounted = false;
    };
  }, [initiallySaved, jobId]);

  async function toggleSaved() {
    setIsSaving(true);
    setError("");
    try {
      if (isSaved) {
        await unsaveJob(jobId);
        setIsSaved(false);
        onSavedChange?.(false);
      } else {
        await saveJob(jobId);
        setIsSaved(true);
        onSavedChange?.(true);
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "We couldn’t update saved jobs. Try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <span className="save-job-control">
      <button
        aria-pressed={isSaved}
        className="button-secondary"
        disabled={isSaving}
        onClick={toggleSaved}
        type="button"
      >
        {isSaving ? "Saving…" : isSaved ? "Saved" : "Save job"}
      </button>
      {error && (
        <span aria-live="polite" className="save-job-error" role="status">
          {error}
        </span>
      )}
    </span>
  );
}
