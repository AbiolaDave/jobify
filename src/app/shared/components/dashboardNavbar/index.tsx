import Image from "next/image";
import Link from "next/link";

const DashboardNavbar = () => (
  <header className="dashboard-header">
    <Link aria-label="Jobify home" className="brand-link" href="/">
      <Image
        alt="Jobify"
        className="brand-image"
        height={100}
        priority
        src="/logo2.png"
        width={100}
      />
    </Link>
    <nav aria-label="Dashboard navigation" className="dashboard-nav">
      <Link href="/dashboard">Overview</Link>
      <Link href="/dashboard/profile">My profile</Link>
      <Link href="/dashboard/applications">Applications</Link>
      <Link href="/dashboard/saved-jobs">Saved jobs</Link>
      <Link href="/dashboard/employer">For employers</Link>
      <Link href="/dashboard/settings">Settings</Link>
    </nav>
    <Link className="button-secondary dashboard-header-cta" href="/jobs">
      Find jobs
    </Link>
  </header>
);

export default DashboardNavbar;
