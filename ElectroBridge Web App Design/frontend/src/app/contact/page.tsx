'use client';

import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0B1120]">
      <div className="max-w-[1100px] mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 flex items-center justify-center mx-auto mb-5">
            <MessageSquare size={24} className="text-[#00E5FF]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-[#94A3B8] max-w-xl mx-auto text-sm">
            Have a question, suggestion, or want to partner with us? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {[
            { icon: <Mail size={16} />, title: 'Email', detail: 'hello@electrobridge.com', desc: 'We reply within 24 hours' },
            { icon: <MessageSquare size={16} />, title: 'Community', detail: 'Join our Discord', desc: 'Chat with the team and community' },
            { icon: <Send size={16} />, title: 'Suggestions', detail: 'Feature requests', desc: 'Help us improve ElectroBridge' },
          ].map((c) => (
            <div key={c.title} className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] mx-auto mb-3">{c.icon}</div>
              <h3 className="font-semibold text-white text-sm mb-1">{c.title}</h3>
              <p className="text-sm text-[#00E5FF] mb-1">{c.detail}</p>
              <p className="text-xs text-[#94A3B8]">{c.desc}</p>
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="max-w-lg mx-auto bg-[#1A2438] border border-[#10B981]/30 rounded-2xl p-10 text-center">
            <CheckCircle size={40} className="text-[#10B981] mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-sm text-[#94A3B8]">We&apos;ll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-[#1A2438] border border-[#1F2937] rounded-2xl p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Name</label>
              <input required className="w-full px-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-sm text-white placeholder:text-[#94A3B8] outline-none focus:border-[#00E5FF]/40 transition-colors" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Email</label>
              <input type="email" required className="w-full px-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-sm text-white placeholder:text-[#94A3B8] outline-none focus:border-[#00E5FF]/40 transition-colors" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Message</label>
              <textarea rows={5} required className="w-full px-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-sm text-white placeholder:text-[#94A3B8] outline-none focus:border-[#00E5FF]/40 transition-colors resize-none" placeholder="Tell us what&apos;s on your mind..." />
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF] text-[#0B1120] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-colors">
              <Send size={14} /> Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}