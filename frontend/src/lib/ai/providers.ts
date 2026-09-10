/**
 * Minimal AI provider stub.
 * Routes through the first available key-based provider at runtime.
 * Replace with your actual AI provider integration.
 */

interface AIResult {
  text: string;
  provider?: string;
  model?: string;
}

export async function callAI(
  prompt: string,
  _systemPrompt?: string,
  _meta?: { feature: string; preferredProvider?: string },
): Promise<AIResult> {
  // Try Groq first, then OpenRouter, then Gemini
  const groqKey = process.env.GROQ_API_KEY;
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (groqKey) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });
    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content || "", provider: "groq", model: "llama-3.1-70b-versatile" };
  }

  if (openrouterKey) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openrouterKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.1-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
      }),
    });
    const data = await res.json();
    return { text: data.choices?.[0]?.message?.content || "", provider: "openrouter", model: "meta-llama/llama-3.1-70b-instruct" };
  }

  if (geminiKey) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );
    const data = await res.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || "", provider: "gemini", model: "gemini-pro" };
  }

  throw new Error("No AI provider configured. Set GROQ_API_KEY, OPENROUTER_API_KEY, or GEMINI_API_KEY.");
}
