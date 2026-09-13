import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://electrobridge.vercel.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/resume`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/resume-review`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/templates`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/cover-letter`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/ask-ai`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/resources`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];
}
