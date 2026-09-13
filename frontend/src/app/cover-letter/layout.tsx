import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cover Letter",
  description:
    "Build a professional, AI-generated cover letter tailored to each job application.",
};

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
