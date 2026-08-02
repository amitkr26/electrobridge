import { Mail, MessageSquare, ExternalLink } from "lucide-react";

const CONTACT_EMAIL = "contact@electrobridge.vercel.app";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the electrobridge team",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-3xl font-bold text-white mb-2">Contact</h1>
      <p className="text-[#94A3B8] text-sm mb-10">
        Have feedback, found a missing opportunity, or spotted a broken link? We read everything.
      </p>

      <div className="space-y-4">
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=electrobridge%20Feedback`}
          className="flex items-center gap-4 bg-[#1A2438] border border-[#1F2937] rounded-xl p-5 hover:border-cyan/50 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-cyan" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-sm">Email us</h2>
            <p className="text-[#94A3B8] text-xs mt-0.5">{CONTACT_EMAIL}</p>
          </div>
          <ExternalLink className="w-4 h-4 text-[#475569] group-hover:text-cyan transition-colors" />
        </a>

        <div className="flex items-center gap-4 bg-[#1A2438] border border-[#1F2937] rounded-xl p-5">
          <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm">Report an issue</h2>
            <p className="text-[#94A3B8] text-xs mt-0.5">
              On any opportunity page, use the &ldquo;Report Issue&rdquo; button so we can investigate the exact listing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}