import { CircuitBoard, Target, Shield, Users, Sparkles } from 'lucide-react';

const values = [
  { icon: <Target size={18} />, label: 'Precision', desc: 'Every opportunity is verified, categorized, and enriched with AI to ensure you never waste time on dead leads.' },
  { icon: <Shield size={18} />, label: 'Trust', desc: 'We actively verify listings, check links, and flag expired posts so you can apply with confidence.' },
  { icon: <Users size={18} />, label: 'Community', desc: 'A thriving network of electronics professionals sharing insights, interview prep, and career guidance.' },
  { icon: <Sparkles size={18} />, label: 'Innovation', desc: 'AI-powered matching, resume scoring, and personalized career roadmaps built for semiconductor professionals.' },
];

const team = [
  { name: 'Arun Sharma', role: 'Founder & CEO', initials: 'AS', bio: 'Ex-Texas Instruments, 10+ years in semiconductor design.' },
  { name: 'Neha Patel', role: 'CTO', initials: 'NP', bio: 'Full-stack engineer, previously at Postman and Razorpay.' },
  { name: 'Dr. Vikram Joshi', role: 'AI Research Lead', initials: 'VJ', bio: 'PhD in ML from IIT Bombay. Focus on NLP for job matching.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0B1120]">
      <div className="max-w-[1100px] mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-14 h-14 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/25 flex items-center justify-center mx-auto mb-5">
            <CircuitBoard size={24} className="text-[#00E5FF]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">About ElectroBridge</h1>
          <p className="text-[#94A3B8] max-w-2xl mx-auto text-sm leading-relaxed">
            We are on a mission to become the definitive career platform for India&apos;s electronics and semiconductor engineering community — bridging the gap between talent and opportunity in the world&apos;s fastest-growing chip ecosystem.
          </p>
        </div>

        <section className="grid md:grid-cols-4 gap-4 mb-20">
          {values.map((v) => (
            <div key={v.label} className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] mx-auto mb-3">
                {v.icon}
              </div>
              <h3 className="font-semibold text-white text-sm mb-2">{v.label}</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </section>

        <section className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Our Story</h2>
          <p className="text-[#94A3B8] text-sm text-center mb-8 max-w-xl mx-auto">From a side project to a movement</p>
          <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-8">
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
              ElectroBridge was born in 2024 when our founder, Arun Sharma, noticed a glaring gap while mentoring final-year electronics students: hundreds of incredible opportunities — from ISRO internships to DRDO fellowships — were buried in PDFs, circulars, and outdated websites.
            </p>
            <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
              Students relied on WhatsApp groups and word-of-mouth. Recruiters struggled to find qualified candidates. The semiconductor industry was hiring aggressively, but the bridge between talent and opportunity simply didn&apos;t exist.
            </p>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Today, ElectroBridge serves 4,200+ verified opportunities to 12,000+ active researchers and engineers — with AI-powered matching, real-time news, and a growing community of professionals shaping India&apos;s semiconductor future.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Leadership Team</h2>
          <p className="text-[#94A3B8] text-sm text-center mb-8">The people behind ElectroBridge</p>
          <div className="grid md:grid-cols-3 gap-5">
            {team.map((m) => (
              <div key={m.name} className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center mx-auto mb-3 text-[#00E5FF] text-lg font-bold">
                  {m.initials}
                </div>
                <h3 className="font-semibold text-white text-sm">{m.name}</h3>
                <p className="text-xs text-[#00E5FF] mb-2">{m.role}</p>
                <p className="text-xs text-[#94A3B8]">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}