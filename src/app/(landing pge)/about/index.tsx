import { BadgeCheck, CircleAlert, ShieldCheck } from "lucide-react";
import Link from "next/link";

const safetySteps = [
  {
    title: "Check the employer",
    description:
      "Look for the Verified employer badge, and take time to confirm a company and role before sharing sensitive information.",
  },
  {
    title: "Never pay to get a job",
    description:
      "Do not pay application, interview, training, or equipment fees to receive a job. A real opportunity should not cost you money.",
  },
  {
    title: "Report anything suspicious",
    description:
      "Use “Report this job” on a listing if details look misleading, discriminatory, or like a request for payment.",
  },
];

export default function About() {
  return (
    <main className="page-shell section-block">
      <section className="about-intro">
        <p className="eyebrow">About Jobify</p>
        <h1 className="section-heading">
          A fairer first step into work.
        </h1>
        <p className="muted-copy">
          Jobify connects Nigeria’s early-career talent with small businesses
          and startups hiring for junior roles, internships, NYSC-friendly
          opportunities, and freelance work.
        </p>
        <div className="badge-row">
          <Link className="button-primary" href="/jobs">
            Explore jobs
          </Link>
          <Link className="button-secondary" href="/sign-up?role=employer">
            Hire with Jobify
          </Link>
        </div>
      </section>

      <section className="trust-panel trust-panel--about">
        <div>
          <p className="eyebrow">Trust & safety</p>
          <h2 className="section-heading">Never pay to get a job.</h2>
          <p className="muted-copy">
            Protect your money and personal information while searching. Jobify
            offers job listings and application tools; no employer should ask
            you to pay Jobify or the employer to apply.
          </p>
        </div>
        <div className="safety-note">
          <ShieldCheck size={24} aria-hidden="true" />
          <span>
            Never share your one-time passcode, banking PIN, or card details
            during a job application.
          </span>
        </div>
      </section>

      <section className="section-block">
        <p className="eyebrow">A few things to look out for</p>
        <h2 className="section-heading">Stay informed as you apply.</h2>
        <div className="safety-grid">
          {safetySteps.map((step, index) => (
            <article className="safety-card" key={step.title}>
              <span className="safety-card-icon" aria-hidden="true">
                {index === 0 ? (
                  <BadgeCheck />
                ) : index === 1 ? (
                  <ShieldCheck />
                ) : (
                  <CircleAlert />
                )}
              </span>
              <h3>{step.title}</h3>
              <p className="muted-copy">{step.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
