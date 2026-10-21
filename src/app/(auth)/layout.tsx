import type { Metadata } from "next";
import "../globals.css";
import OfflineNotice from "../shared/components/offlineNotice";

export const metadata: Metadata = {
  title: "Join Jobify",
  description: "Sign in or create your Jobify account.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <OfflineNotice />
        {children}
      </body>
    </html>
  );
}
