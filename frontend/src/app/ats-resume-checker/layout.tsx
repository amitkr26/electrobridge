import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker & Score",
  description: "Check your resume's ATS compatibility score for free. Identify keyword gaps, formatting issues, and get actionable improvements before applying to jobs.",
};

export default function ATSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
