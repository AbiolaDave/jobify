import type { FormEvent } from "react";
import type { Seeker } from "@/types/platform";

interface Props {
  profile: Seeker;
  cvName: string;
  error: string;
  message: string;
  isSaving: boolean;
  onSelectCv: (file?: File) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function SeekerProfileForm({
  profile,
  cvName,
  error,
  message,
  isSaving,
  onSelectCv,
  onSubmit,
}: Props) {
  return (
    <form className="profile-form" onSubmit={onSubmit}>
      <fieldset className="form-section">
        <legend>About you</legend>
        <div className="form-grid">
          <label className="filter-group" htmlFor="profile-name">
            Full name
            <input
              autoComplete="name"
              className="filter-control"
              defaultValue={profile.fullName}
              id="profile-name"
              name="fullName"
              required
            />
          </label>
          <label className="filter-group" htmlFor="profile-headline">
            Headline
            <input
              className="filter-control"
              defaultValue={profile.headline}
              id="profile-headline"
              name="headline"
              placeholder="e.g. Junior frontend developer"
              required
            />
          </label>
          <label className="filter-group" htmlFor="profile-phone">
            Phone number
            <input
              autoComplete="tel"
              className="filter-control"
              defaultValue={profile.phone}
              id="profile-phone"
              inputMode="tel"
              name="phone"
              placeholder="+234 801 234 5678"
              required
            />
          </label>
          <label className="filter-group" htmlFor="profile-email">
            Email (optional)
            <input
              autoComplete="email"
              className="filter-control"
              defaultValue={profile.email}
              id="profile-email"
              name="email"
              type="email"
            />
          </label>
          <label className="filter-group form-grid-wide" htmlFor="profile-skills">
            Skills (separate with commas)
            <input
              className="filter-control"
              defaultValue={profile.skills.join(", ")}
              id="profile-skills"
              name="skills"
              placeholder="Figma, React, customer support"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Education</legend>
        <label className="filter-group" htmlFor="education">
          One entry per line: qualification | school | year
          <textarea
            className="filter-control"
            defaultValue={profile.education
              .map((item) =>
                [item.qualification, item.institution, item.year]
                  .filter(Boolean)
                  .join(" | "),
              )
              .join("\n")}
            id="education"
            name="education"
            placeholder="BSc Computer Science | University of Lagos | 2024"
            rows={3}
          />
        </label>
      </fieldset>

      <fieldset className="form-section">
        <legend>Experience</legend>
        <label className="filter-group" htmlFor="experience">
          One entry per line: role | organisation | what you did
          <textarea
            className="filter-control"
            defaultValue={profile.experience
              .map((item) =>
                [item.title, item.organisation, item.description]
                  .filter(Boolean)
                  .join(" | "),
              )
              .join("\n")}
            id="experience"
            name="experience"
            placeholder="Frontend Intern | Bright Labs | Built accessible web pages"
            rows={4}
          />
        </label>
      </fieldset>

      <fieldset className="form-section">
        <legend>Portfolio and CV</legend>
        <div className="form-grid">
          <label className="filter-group form-grid-wide" htmlFor="profile-links">
            Portfolio links (separate with commas)
            <input
              className="filter-control"
              defaultValue={profile.portfolioLinks.join(", ")}
              id="profile-links"
              name="portfolioLinks"
              placeholder="https://yourportfolio.ng"
            />
          </label>
          <label className="filter-group form-grid-wide" htmlFor="profile-cv">
            CV (PDF or DOCX, up to 5 MB)
            <input
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="filter-control"
              id="profile-cv"
              onChange={(event) => onSelectCv(event.target.files?.[0])}
              type="file"
            />
            {cvName && (
              <span className="muted-copy">
                Selected: {decodeFileName(cvName)}
              </span>
            )}
          </label>
        </div>
        <p className="muted-copy">
          Preview only: the selected CV stays in this browser session and is not
          uploaded to a server yet.
        </p>
      </fieldset>

      {error && (
        <p className="auth-message auth-message--error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p aria-live="polite" className="auth-message" role="status">
          {message}
        </p>
      )}
      <button className="button-primary" disabled={isSaving} type="submit">
        {isSaving ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}

function decodeFileName(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
