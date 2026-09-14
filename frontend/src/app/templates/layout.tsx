import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates",
  description:
    "10 professional, ATS-optimized resume templates for engineers and technical professionals.",
  openGraph: {
    title: "Templates",
    description:
      "10 professional, ATS-optimized resume templates for engineers and technical professionals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Templates",
    description:
      "10 professional, ATS-optimized resume templates for engineers and technical professionals.",
  },
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
