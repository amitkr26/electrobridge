/**
 * AI provider abstraction.
 * Routes through the first available key-based provider at runtime.
 */

interface AIResult {
  text: string;
  provider?: string;
  model?: string;
}

export async function callAI(
  prompt: string,
  systemPrompt?: string,
  _meta?: { feature: string; preferredProvider?: string },
): Promise<AIResult> {
  const groqKey = process.env.GROQ_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const messages = systemPrompt
    ? [{ role: "system" as const, content: systemPrompt }, { role: "user" as const, content: prompt }]
    : [{ role: "user" as const, content: prompt }];

  // ponytail: try providers in order, first wins. Timeout per fetch = 30s.
  const TIMEOUT_MS = 30_000;

  if (groqKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({ model: "llama-3.1-70b-versatile", messages, max_tokens: 1024, temperature: 0.7 }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        if (text) return { text, provider: "groq", model: "llama-3.1-70b-versatile" };
      }
    } catch { /* fall through to next provider */ }
  }

  if (openrouterKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${openrouterKey}` },
        body: JSON.stringify({ model: "meta-llama/llama-3.1-70b-instruct", messages, max_tokens: 1024 }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content || "";
        if (text) return { text, provider: "openrouter", model: "meta-llama/llama-3.1-70b-instruct" };
      }
    } catch { /* fall through to next provider */ }
  }

  if (geminiKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      // ponytail: pass key via x-goog-api-key header instead of URL query param to avoid log exposure
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": geminiKey },
          body: JSON.stringify({ contents: [{ parts: [{ text: messages.map(m => m.content).join("\n\n") }] }] }),
          signal: controller.signal,
        },
      );
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (text) return { text, provider: "gemini", model: "gemini-pro" };
      }
    } catch { /* fall through */ }
  }

  throw new Error("No AI provider available. Set GROQ_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY.");
}
