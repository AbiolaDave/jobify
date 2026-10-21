import Image from "next/image";
import Link from "next/link";
import ActiveLink from "../../utils/activeLink";

const Navbar = () => {
  return (
    <header className="site-header">
      <Link className="brand-link" href="/" aria-label="Jobify home">
        <Image
          className="brand-image"
          width={100}
          height={100}
          src="/logo2.png"
          alt="Jobify"
          priority
        />
      </Link>
      <nav aria-label="Main navigation" className="site-nav">
        <ActiveLink href="/">Home</ActiveLink>
        <ActiveLink href="/jobs">Jobs</ActiveLink>
        <ActiveLink href="/about">About</ActiveLink>
        <ActiveLink href="/services">Services</ActiveLink>
        <ActiveLink href="/contacts">Contact</ActiveLink>
      </nav>
      <Link className="button-primary" href="/sign-up">
        Get started
      </Link>
    </header>
  );
};

export default Navbar;
