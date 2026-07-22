import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import AppLayout from "@/components/AppLayout";
import Providers from "@/components/Providers";
import { AuthSync } from "@/components/AuthSync";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://electrobridge.vercel.app"),
  title: {
    default: "electrobridge — Verified Semiconductor & VLSI Opportunity Engine",
    template: "%s | electrobridge",
  },
  description:
    "Find JRF, PhD positions, government research jobs, fellowships, and private sector opportunities in semiconductor, VLSI, and electronics industry. DRDO, ISRO, CSIR, IIT opportunities aggregated in one place.",
  keywords: [
    "JRF", "Junior Research Fellow", "electronics jobs India", "semiconductor jobs",
    "DRDO recruitment", "ISRO JRF", "CSIR fellowship", "PhD electronics India",
    "VLSI jobs", "ASIC design jobs", "embedded systems jobs", "research fellowship India",
    "NET electronics jobs", "GATE electronics jobs", "electrobridge", "semiconductor India",
  ],
  authors: [{ name: "electrobridge" }],
  creator: "electrobridge",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://electrobridge.vercel.app",
    siteName: "electrobridge",
    title: "electrobridge — Verified Semiconductor & VLSI Opportunity Engine",
    description:
      "One-stop engine for JRF, PhD, government and private sector opportunities in semiconductor, VLSI, and electronics industry.",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "electrobridge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "electrobridge — Verified Semiconductor & Electronics Opportunities",
    description:
      "Find JRF, PhD, DRDO, ISRO, CSIR opportunities in VLSI & semiconductor. Updated daily.",
    images: ["/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "noarchive": true
    },
  },
  alternates: { canonical: "https://berojgardegreewala.vercel.app" },
  verification: {
    google: "QnEIBEpKxP_ZiQxtneegX-6WWKxO_FZ8Yzzxp4kOqxA",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8fafc",
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
        <AuthSync />
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
        <Toaster position="bottom-right" toastOptions={{ style: { background: '#111827', border: '1px solid #374151', color: '#F9FAFB' } }} />
        <Script defer data-domain="berojgardegreewala.vercel.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
