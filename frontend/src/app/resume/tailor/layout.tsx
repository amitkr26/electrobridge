import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tailor Resume to Job | ElectroBridge",
  description: "Match your resume to a specific job description. Get ATS optimization, keyword analysis, and AI-powered resume tailoring for semiconductor and VLSI engineering roles.",
  openGraph: {
    title: "Tailor Resume to Job | ElectroBridge",
    description: "Match your resume to a specific job description with AI-powered analysis and optimization.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tailor Resume to Job | ElectroBridge",
    description: "Match your resume to a specific job description with AI-powered analysis and optimization.",
  },
};

export default function TailorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
