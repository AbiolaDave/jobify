"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} aria-current={isActive ? "page" : undefined}>
      {children}
    </Link>
  );
};

export default ActiveLink;
