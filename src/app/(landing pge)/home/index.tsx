import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  MapPin,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import JobCard from "@/app/shared/components/jobCard";
import { getFeaturedJobs } from "@/services/jobs";

export const dynamic = "force-dynamic";

const jobCategories = [
  { name: "Engineering", count: "Software, data & IT" },
  { name: "Design", count: "Product & visual design" },
  { name: "Marketing", count: "Content & growth" },
  { name: "Operations", count: "Business & people" },
  { name: "Customer Success", count: "Support & service" },
  { name: "Finance", count: "Accounting & fintech" },
];

export default async function HomePage() {
  const { jobs: featuredJobs, warning } = await getFeaturedJobs();

  return (
    <main>
      <section className="landing-hero">
        <div className="page-shell hero-content">
          <div>
            <p className="eyebrow">A better start to your career</p>
            <h1 className="hero-title">
              Your next big <span>opportunity</span> starts here.
            </h1>
            <p className="muted-copy">
              Find trusted entry-level jobs, internships, NYSC roles, and
              freelance work from employers across Nigeria.
            </p>

            <form className="hero-search" action="/jobs" method="get">
              <div className="field-wrap">
                <label htmlFor="hero-query">What are you looking for?</label>
                <input
                  id="hero-query"
                  name="query"
                  placeholder="Job title, skill, or company"
                  type="search"
                />
              </div>
              <div className="field-wrap">
                <label htmlFor="hero-state">Where?</label>
                <select id="hero-state" name="state" defaultValue="">
                  <option value="">Anywhere in Nigeria</option>
                  <option value="Lagos">Lagos</option>
                  <option value="FCT">Abuja (FCT)</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <button className="button-primary" type="submit">
                <MapPin size={17} aria-hidden="true" />
                Find jobs
              </button>
            </form>

            <p className="muted-copy">
              Popular:{" "}
              <Link href="/jobs?category=Engineering">Engineering</Link>,{" "}
              <Link href="/jobs?type=Internship">Internships</Link>,{" "}
              <Link href="/jobs?remote=true">Remote</Link>
            </p>
          </div>

          <aside className="hero-aside" aria-label="Jobify at a glance">
            <p className="eyebrow">Made for your next step</p>
            <h2>Real opportunities. A fair start.</h2>
            <p className="muted-copy">
              Find roles that welcome early-career talent, from your first
              internship to your first full-time offer.
            </p>
            <div className="hero-stat-list">
              <div className="hero-stat">
                <span className="hero-stat-icon">
                  <BadgeCheck size={20} aria-hidden="true" />
                </span>
                <span>
                  <strong>Verified employers</strong>
                  <br />
                  More confidence when you apply
                </span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-icon">
                  <BriefcaseBusiness size={20} aria-hidden="true" />
                </span>
                <span>
                  <strong>Early-career friendly</strong>
                  <br />
                  Roles for graduates, students & NYSC
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="page-shell section-block">
        <div className="results-toolbar">
          <div>
            <p className="eyebrow">Hand-picked for you</p>
            <h2 className="section-heading">Featured opportunities</h2>
          </div>
          <Link className="button-secondary" href="/jobs">
            Browse all jobs <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        {warning && (
          <p aria-live="polite" className="auth-message" role="status">
            {warning}
          </p>
        )}
        <div className="job-grid">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section className="section-block surface-band">
        <div className="page-shell">
          <p className="eyebrow">Explore by interest</p>
          <h2 className="section-heading">A path for what you do best</h2>
          <div className="category-grid">
            {jobCategories.map((category) => (
              <Link
                className="category-link"
                href={`/jobs?category=${encodeURIComponent(category.name)}`}
                key={category.name}
              >
                <strong>{category.name}</strong>
                <span>{category.count} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell section-block">
        <div className="trust-panel">
          <div>
            <p className="eyebrow">Your safety comes first</p>
            <h2 className="section-heading">A job should never cost you money.</h2>
            <p className="muted-copy">
              Jobify is built to make opportunities clearer and safer for
              everyone. Look for verified employers and trust your instincts.
            </p>
          </div>
          <div>
            <p className="safety-note">
              <ShieldCheck size={22} aria-hidden="true" />
              <span>
                <strong>Never pay to get a job.</strong> Legitimate employers
                will not ask you for money to apply, interview, or receive an
                offer.
              </span>
            </p>
            <Link className="button-secondary" href="/about">
              Learn about staying safe <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="page-shell section-block">
        <div className="trust-panel">
          <div>
            <p className="eyebrow">Your next chapter starts here</p>
            <h2 className="section-heading">Ready to make your next move?</h2>
            <p className="muted-copy">
              Join early-career talent and small businesses building what comes
              next in Nigeria.
            </p>
          </div>
          <div className="badge-row">
            <Link className="button-secondary" href="/sign-up">
              <UsersRound size={17} aria-hidden="true" />
              I’m looking for work
            </Link>
            <Link className="button-primary" href="/sign-up?role=employer">
              I’m hiring <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
