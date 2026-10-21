import type { Metadata } from "next";
import "../globals.css";
import Footer from "../shared/components/footer";
import Navbar from "../shared/components/navbar";
import OfflineNotice from "../shared/components/offlineNotice";

export const metadata: Metadata = {
  title: "Jobify | Find your next opportunity",
  description:
    "Discover trusted jobs, internships, NYSC roles, and freelance opportunities across Nigeria.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <Navbar />
        <OfflineNotice />
        {children}
        <Footer />
      </body>
    </html>
  );
}
