import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Career Assistant",
  description:
    "AI-powered career assistant - get personalized resume improvements, job matching, and career guidance.",
};

export default function AskAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
