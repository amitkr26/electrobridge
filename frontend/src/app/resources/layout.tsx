import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Free career resources for engineers - resume guides, interview prep, salary info, and career roadmaps.",
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
