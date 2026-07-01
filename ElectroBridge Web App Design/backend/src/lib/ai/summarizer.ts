import { callGroq } from "./groq.js";

export async function summarizeText(text: string): Promise<{ summary: string; keyPoints: string[] }> {
  try {
    const textContent = await callGroq(
      `Summarize the following text into 2-3 concise sentences and list 3-5 key points:\n\n${text}`,
    );
    const lines = textContent.split("\n").filter(l => l.trim());
    const keyPoints = lines.filter(l => l.trim().startsWith("-") || l.trim().startsWith("*"));
    return { summary: lines[0] || textContent, keyPoints };
  } catch {
    return { summary: "Summary unavailable.", keyPoints: [] };
  }
}