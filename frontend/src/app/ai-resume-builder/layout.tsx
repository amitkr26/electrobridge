import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Resume Builder for Engineers",
  description: "Build an ATS-optimized resume with AI assistance. Get intelligent suggestions, skill gap analysis, and professional templates — free for engineers and job seekers.",
};

export default function AIResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
