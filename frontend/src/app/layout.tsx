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
    default: "ElectroBridge — AI Career Assistant for Semiconductor Engineers",
    template: "%s | ElectroBridge",
  },
  description:
    "AI-powered career assistant for semiconductor and VLSI engineers. Chat with an AI expert and build a tailored resume for VLSI, embedded systems, and electronics roles.",
  keywords: [
    "semiconductor engineer", "VLSI", "AI career assistant", "resume builder",
    "electronics jobs", "embedded systems", "ASIC design", "electrobridge",
  ],
  authors: [{ name: "ElectroBridge" }],
  creator: "ElectroBridge",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://electrobridge.vercel.app",
    siteName: "ElectroBridge",
    title: "ElectroBridge — AI Career Assistant for Semiconductor Engineers",
    description:
      "AI-powered career assistant for semiconductor and VLSI engineers. Chat with an AI expert and build a tailored resume.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ElectroBridge — AI Career Assistant for Semiconductor Engineers",
    description:
      "AI-powered career assistant for semiconductor and VLSI engineers.",
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
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-body bg-navy text-text-primary min-h-screen`}
      >
        <AppLayout>{children}</AppLayout>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#111827', border: '1px solid #374151', color: '#F9FAFB' } }} />
        <Script defer data-domain="electrobridge.vercel.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
