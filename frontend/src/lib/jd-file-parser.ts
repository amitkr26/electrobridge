"use client";

/**
 * Client-side file parsing for Job Description uploads.
 * Supports PDF, DOCX, TXT. Sends to /api/profile/parse-resume for extraction.
 */

export async function parseUploadedFile(file: File): Promise<string> {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (file.size > MAX_SIZE) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!["pdf", "docx", "txt", "md"].includes(ext || "")) {
    throw new Error("Unsupported format. Please upload a PDF, DOCX, or TXT file.");
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/profile/parse-resume", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to parse file.");
  }

  // For JD parsing, we want the raw text, not structured data
  // The parse-resume endpoint returns profile data, but for JDs we need raw text
  // So we'll read the file directly for TXT, and use the AI for PDF/DOCX
  if (ext === "txt" || ext === "md") {
    return await file.text();
  }

  // For PDF/DOCX, we need to extract text differently
  // Use the parse-resume endpoint but extract the raw text from the response
  // Actually, let's just read the file as text for TXT and use a simpler approach for PDF/DOCX
  return extractTextFromFile(file);
}

async function extractTextFromFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "txt" || ext === "md") {
    return await file.text();
  }

  // For PDF and DOCX, we'll use a FormData upload to our parse endpoint
  // and reconstruct the text from the structured response
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/profile/parse-resume", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to parse file.");
  }

  // Reconstruct text from the profile data
  if (data.profile) {
    const p = data.profile;
    const parts: string[] = [];
    if (p.about) parts.push(p.about);
    if (p.skills?.length) parts.push(p.skills.join(", "));
    if (p.experience?.length) {
      p.experience.forEach((e: any) => {
        parts.push(`${e.role || ""} ${e.company || ""} ${e.description || ""}`);
      });
    }
    if (p.education?.length) {
      p.education.forEach((e: any) => {
        parts.push(`${e.degree || ""} ${e.institution || ""}`);
      });
    }
    if (p.projects?.length) {
      p.projects.forEach((proj: any) => {
        parts.push(`${proj.name || ""} ${proj.technologies || ""} ${proj.description || ""}`);
      });
    }
    return parts.filter(Boolean).join("\n");
  }

  throw new Error("Could not extract text from file. Please paste the job description instead.");
}
