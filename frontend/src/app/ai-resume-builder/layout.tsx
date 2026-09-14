import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Resume Builder for Engineers",
  description: "Build an ATS-optimized resume with AI assistance. Get intelligent suggestions, skill gap analysis, and professional templates — free for engineers and job seekers.",
  openGraph: {
    title: "Free AI Resume Builder for Engineers",
    description: "Build an ATS-optimized resume with AI assistance. Get intelligent suggestions, skill gap analysis, and professional templates — free for engineers and job seekers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Resume Builder for Engineers",
    description: "Build an ATS-optimized resume with AI assistance. Get intelligent suggestions, skill gap analysis, and professional templates — free for engineers and job seekers.",
  },
};

export default function AIResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
