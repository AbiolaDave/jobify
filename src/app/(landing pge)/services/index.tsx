import { ArrowRight, BriefcaseBusiness, FileUser, Search } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Find a role that fits",
    description:
      "Search opportunities by Nigerian state, job type, experience level, category, and salary range.",
    icon: Search,
    href: "/jobs",
    action: "Browse jobs",
  },
  {
    title: "Keep your search organised",
    description:
      "Save roles, build a lean profile, and check the status of your applications in one place.",
    icon: FileUser,
    href: "/dashboard",
    action: "Open your dashboard",
  },
  {
    title: "Hire early-career talent",
    description:
      "Write a clear junior-friendly job post and review applicants with shortlist and reject actions.",
    icon: BriefcaseBusiness,
    href: "/dashboard/employer",
    action: "Explore hiring",
  },
];

export default function Services() {
  return (
    <main className="page-shell section-block">
      <section className="about-intro">
        <p className="eyebrow">What you can do with Jobify</p>
        <h1 className="section-heading">
          Practical tools for your next step.
        </h1>
        <p className="muted-copy">
          Whether you’re starting your career or growing a small team, Jobify
          helps make the next step clearer.
        </p>
      </section>
      <section aria-label="Jobify services" className="safety-grid">
        {services.map(({ title, description, icon: Icon, href, action }) => (
          <article className="service-card" key={title}>
            <span className="service-card-icon" aria-hidden="true">
              <Icon size={24} />
            </span>
            <h2>{title}</h2>
            <p className="muted-copy">{description}</p>
            <Link className="button-quiet" href={href}>
              {action} <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
