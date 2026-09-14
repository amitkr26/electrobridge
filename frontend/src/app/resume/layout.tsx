import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Resume Builder for Engineers",
  description: "Build a professional, ATS-optimized resume with 10 templates. Free resume builder for engineers, VLSI professionals, and semiconductor careers.",
  openGraph: {
    title: "Free Resume Builder for Engineers",
    description: "Build a professional, ATS-optimized resume with 10 templates. Free resume builder for engineers, VLSI professionals, and semiconductor careers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Resume Builder for Engineers",
    description: "Build a professional, ATS-optimized resume with 10 templates. Free resume builder for engineers, VLSI professionals, and semiconductor careers.",
  },
};

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
