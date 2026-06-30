import { callAI } from "./providers.js";

export async function summarizeText(text: string): Promise<{ summary: string; keyPoints: string[] }> {
  try {
    const response = await callAI(
      `Summarize the following text into 2-3 concise sentences and list 3-5 key points:\n\n${text}`,
      undefined,
      { preferredProvider: "groq", feature: "summarize" },
    );
    const lines = response.text.split("\n").filter(l => l.trim());
    const keyPoints = lines.filter(l => l.trim().startsWith("-") || l.trim().startsWith("*"));
    return { summary: lines[0] || response.text, keyPoints };
  } catch {
    return { summary: "Summary unavailable.", keyPoints: [] };
  }
}