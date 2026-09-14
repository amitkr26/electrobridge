import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact ElectroBridge - reach out with questions, feedback, or collaboration ideas.",
  openGraph: {
    title: "Contact",
    description:
      "Contact ElectroBridge - reach out with questions, feedback, or collaboration ideas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    description:
      "Contact ElectroBridge - reach out with questions, feedback, or collaboration ideas.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
