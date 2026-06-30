import { supabase } from "../supabase.js";

export type AIProvider = "groq" | "gemini" | "openrouter";
const PROVIDER_ORDER: AIProvider[] = ["groq", "gemini", "openrouter"];
const PROVIDER_MODELS: Record<AIProvider, string> = {
  groq: "llama-3.3-70b-versatile",
  gemini: "gemini-2.0-flash",
  openrouter: "meta-llama/llama-3.1-8b-instruct:free",
};
const PROVIDER_ENV_KEYS: Record<AIProvider, string> = {
  groq: "GROQ_API_KEY",
  gemini: "GEMINI_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
};

async function logUsage(entry: { feature: string; provider: AIProvider; success: boolean; error?: string }) {
  if (!supabase) return;
  try {
    await supabase.from("ai_usage_log").insert({
      feature: entry.feature,
      provider: entry.provider,
      success: entry.success,
      error_message: entry.error || null,
    }).maybeSingle();
  } catch { /* silently fail */ }
}

async function callGroq(prompt: string, systemPrompt?: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
        { role: "user" as const, content: prompt },
      ],
      max_tokens: 1024, temperature: 0.3,
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`Groq error ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

async function callGemini(prompt: string, systemPrompt?: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt }] }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.3 },
      }),
      signal: AbortSignal.timeout(30000),
    },
  );
  if (!res.ok) throw new Error(`Gemini error ${res.status}`);
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function callOpenRouter(prompt: string, systemPrompt?: string): Promise<string> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://electrobridge.com",
      "X-Title": "ElectroBridge",
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        ...(systemPrompt ? [{ role: "system" as const, content: systemPrompt }] : []),
        { role: "user" as const, content: prompt },
      ],
      max_tokens: 1024,
    }),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) throw new Error(`OpenRouter error ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

export async function callAI(prompt: string, systemPrompt?: string, options?: { preferredProvider?: AIProvider; feature?: string }): Promise<{ text: string; provider: AIProvider; model: string }> {
  const feature = options?.feature || "unknown";
  const order = options?.preferredProvider
    ? [options.preferredProvider, ...PROVIDER_ORDER.filter(p => p !== options.preferredProvider)]
    : PROVIDER_ORDER;

  for (const provider of order) {
    const envKey = PROVIDER_ENV_KEYS[provider];
    if (!process.env[envKey]) continue;
    try {
      let text: string;
      switch (provider) {
        case "groq": text = await callGroq(prompt, systemPrompt); break;
        case "gemini": text = await callGemini(prompt, systemPrompt); break;
        case "openrouter": text = await callOpenRouter(prompt, systemPrompt); break;
        default: continue;
      }
      logUsage({ feature, provider, success: true });
      return { text, provider, model: PROVIDER_MODELS[provider] };
    } catch (error) {
      console.warn(`[AI] ${provider} failed:`, error);
      logUsage({ feature, provider, success: false, error: error instanceof Error ? error.message : String(error) });
      continue;
    }
  }
  throw new Error("All AI providers failed. Please try again later.");
}