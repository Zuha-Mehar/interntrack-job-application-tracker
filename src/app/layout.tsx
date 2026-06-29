import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InternTrack | Smart Job Application Tracker",
  description:
    "Track job applications, interviews, reminders, skills, and analytics in one clean dashboard.",
  keywords: [
    "InternTrack",
    "Job Tracker",
    "Internship Tracker",
    "Application Tracker",
    "Job Search Dashboard",
  ],
  authors: [{ name: "Zuha Mehar" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
