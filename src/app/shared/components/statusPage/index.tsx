import Link from "next/link";

export default function StatusPage({
  title,
  description,
  action = "Browse jobs",
  href = "/jobs",
}: {
  title: string;
  description: string;
  action?: string;
  href?: string;
}) {
  return (
    <main className="page-shell status-page">
      <p className="eyebrow">Jobify</p>
      <h1 className="section-heading">{title}</h1>
      <p className="muted-copy">{description}</p>
      <Link className="button-primary" href={href}>
        {action}
      </Link>
    </main>
  );
}
