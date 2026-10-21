import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "Your Jobify dashboard",
  description: "Manage your profile, applications, and saved jobs on Jobify.",
};

export default function RootLayout({
  children,
  data,
  jobs,
}: Readonly<{
  children: React.ReactNode;
  data: React.ReactNode;
  jobs: React.ReactNode;
}>) {
  void data;
  void jobs;
  return (
    <>{children}</>
  );
}
