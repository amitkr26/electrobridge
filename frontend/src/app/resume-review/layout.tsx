import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ATS Score",
  description:
    "Check your resume's ATS compatibility score with detailed analysis and improvement suggestions.",
};

export default function ResumeReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
