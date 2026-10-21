"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import SeekerProfileForm from "@/app/shared/components/seekerProfileForm";
import { getSeekerProfile, updateSeekerProfile, uploadCv } from "@/services/api";
import type { Seeker } from "@/types/platform";

const emptyProfile: Seeker = {
  id: "preview-seeker",
  fullName: "",
  headline: "",
  phone: "",
  skills: [],
  education: [],
  experience: [],
  portfolioLinks: [],
  profileCompleteness: 0,
};

export default function ProfileEditor() {
  const [profile, setProfile] = useState<Seeker>(emptyProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [cvName, setCvName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      try {
        const result = await getSeekerProfile();
        if (isMounted) {
          setProfile(result);
          setCvName(result.cvUrl?.replace(/^preview-file:/, "") ?? "");
        }
      } catch {
        if (isMounted) setError("We couldn’t load your profile. Try again.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get("phone") ?? "").replace(/\s/g, "");
    if (!/^\+234\d{10}$/.test(phone)) {
      setError("Enter a valid phone number in +234 format.");
      return;
    }

    setIsSaving(true);
    try {
      const updated = await updateSeekerProfile({
        fullName: String(formData.get("fullName") ?? "").trim(),
        headline: String(formData.get("headline") ?? "").trim(),
        phone,
        email: String(formData.get("email") ?? "").trim() || undefined,
        skills: splitList(String(formData.get("skills") ?? "")),
        portfolioLinks: splitList(String(formData.get("portfolioLinks") ?? "")),
        education: parseEducation(String(formData.get("education") ?? "")),
        experience: parseExperience(String(formData.get("experience") ?? "")),
        cvUrl: profile.cvUrl,
      });
      setProfile(updated);
      setCvName(updated.cvUrl?.replace(/^preview-file:/, "") ?? "");
      setMessage("Your profile was saved in this preview.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "We couldn’t save your profile. Try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function selectCv(file: File | undefined) {
    if (!file) return;
    setError("");
    try {
      const result = await uploadCv(file);
      setProfile((current) => ({ ...current, cvUrl: result.cvUrl }));
      setCvName(result.fileName);
      setMessage("CV selected for preview. Save your profile to keep the selection.");
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "We couldn’t select that file.",
      );
    }
  }

  if (isLoading) {
    return (
      <main aria-busy="true" className="page-shell dashboard-content">
        <div className="skeleton" />
      </main>
    );
  }

  return (
    <main className="page-shell dashboard-content">
      <div className="dashboard-heading">
        <div>
          <p className="eyebrow">Your profile</p>
          <h1 className="section-heading">Make it easier to say yes to you.</h1>
          <p className="muted-copy">
            A clear profile helps employers understand what you can do.
          </p>
        </div>
        <Link className="button-secondary" href="/jobs">
          Find jobs
        </Link>
      </div>

      <section aria-label="Profile completeness" className="completeness-card">
        <div className="completeness-heading">
          <strong>Profile completeness</strong>
          <strong>{profile.profileCompleteness}%</strong>
        </div>
        <progress max={100} value={profile.profileCompleteness}>
          {profile.profileCompleteness}%
        </progress>
        <p className="muted-copy">
          Add your skills, education, experience, and CV to help your profile
          stand out.
        </p>
      </section>

      <SeekerProfileForm
        cvName={cvName}
        error={error}
        isSaving={isSaving}
        message={message}
        onSelectCv={selectCv}
        onSubmit={saveProfile}
        profile={profile}
      />
    </main>
  );
}

function splitList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseEducation(value: string): Seeker["education"] {
  return value
    .split(/\r?\n/)
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(([qualification, institution]) => Boolean(qualification || institution))
    .map(([qualification, institution, year]) => ({
      qualification: qualification ?? "",
      institution: institution ?? "",
      ...(year && Number.isInteger(Number(year)) ? { year: Number(year) } : {}),
    }));
}

function parseExperience(value: string): Seeker["experience"] {
  return value
    .split(/\r?\n/)
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(([title, organisation]) => Boolean(title || organisation))
    .map(([title, organisation, description]) => ({
      title: title ?? "",
      organisation: organisation ?? "",
      ...(description ? { description } : {}),
    }));
}
