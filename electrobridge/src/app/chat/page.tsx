"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Zap, Sparkles } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  provider?: string;
}

const SUGGESTIONS = [
  "Find JRF for NET Electronics",
  "DRDO vs CSIR opportunities",
  "International PhD for thin film researcher",
  "ISRO recruitment process",
  "How to apply for DAAD fellowship",
  "Difference between JRF and SRF",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm ElectroBridge Assistant. I can help you find opportunities, understand eligibility criteria, and guide you through research careers in electronics and semiconductor fields. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    setShowSuggestions(false);
    const newMessages = [
      ...messages,
      { role: "user" as const, content: text },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("Chat failed");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          provider: data.provider,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-text-primary flex items-center gap-3">
          <Bot className="w-8 h-8 text-cyan" />
          Ask ElectroBridge
        </h1>
        <p className="text-text-muted mt-2 text-sm">
          AI-powered assistant for electronics and semiconductor researchers in India.
        </p>
      </div>

      <div className="bg-navy-light border border-gray-800 rounded-xl overflow-hidden">
        <div className="h-[500px] overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-cyan" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-cyan text-navy"
                    : "bg-gray-800 text-text-primary"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.provider && (
                  <p className="text-[10px] text-text-muted mt-1 opacity-60">
                    Powered by {msg.provider.charAt(0).toUpperCase() + msg.provider.slice(1)}
                  </p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-text-muted" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-cyan" />
              </div>
              <div className="bg-gray-800 rounded-xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-cyan animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {showSuggestions && messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-text-muted text-xs mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan" />
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-text-muted text-xs hover:border-cyan/30 hover:text-cyan transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-800 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about opportunities, careers, eligibility..."
              disabled={loading}
              className="flex-1 bg-gray-800 border border-gray-700 text-text-primary text-sm rounded-lg px-4 py-2.5 focus:ring-cyan focus:border-cyan outline-none disabled:opacity-50 placeholder:text-text-muted/50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-cyan text-navy rounded-lg px-4 py-2.5 hover:bg-cyan/90 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
