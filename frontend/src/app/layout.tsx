import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://electrobridge.vercel.app"),
  title: {
    default: "ElectroBridge — AI Resume Builder for Semiconductor Engineers",
    template: "%s | ElectroBridge",
  },
  description:
    "Build ATS-optimized resumes with 10 professional templates. AI-powered enhancement, skill gap analysis, and career chat. 100% free.",
  keywords: [
    "resume builder",
    "VLSI resume",
    "semiconductor jobs",
    "ATS resume",
    "AI career assistant",
    "chip design resume",
    "electronics engineer resume",
    "ASIC design",
    "embedded systems",
    "electrobridge",
  ],
  authors: [{ name: "ElectroBridge" }],
  creator: "ElectroBridge",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://electrobridge.vercel.app",
    siteName: "ElectroBridge",
    title: "ElectroBridge — AI Resume Builder for Semiconductor Engineers",
    description:
      "Build ATS-optimized resumes with 10 professional templates. AI-powered enhancement, skill gap analysis, and career chat. 100% free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectroBridge — AI Resume Builder for Semiconductor Engineers",
    description:
      "Build ATS-optimized resumes with 10 professional templates. AI-powered enhancement, skill gap analysis, and career chat. 100% free.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "noarchive": true,
    },
  },
  alternates: { canonical: "https://electrobridge.vercel.app" },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F8FAFC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body bg-background text-foreground min-h-screen`}
      >
        <AppLayout>{children}</AppLayout>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#fff', border: '1px solid #E2E8F0', color: '#0F172A' } }} />
        <Script defer data-domain="electrobridge.vercel.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
