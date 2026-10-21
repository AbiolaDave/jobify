import type { Metadata } from "next";
import "../globals.css";
import DashboardNavbar from "../shared/components/dashboardNavbar";
import Footer from "../shared/components/footer";
import OfflineNotice from "../shared/components/offlineNotice";

export const metadata: Metadata = {
  title: "Your Jobify dashboard",
  description: "Manage your profile, applications, and saved jobs on Jobify.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <DashboardNavbar />
        <OfflineNotice />
        {children}
        <Footer />
      </body>
    </html>
  );
}
