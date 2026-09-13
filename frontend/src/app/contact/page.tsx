"use client";

import { Mail, Linkedin, MapPin, ExternalLink } from "lucide-react";

const CONTACTS = [
  {
    icon: Mail,
    label: "Email",
    value: "support@electrobridge.in",
    href: "mailto:support@electrobridge.in",
    isExternal: false,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "India",
    href: null,
    isExternal: false,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "ElectroBridge",
    href: "https://www.linkedin.com/in/rankrseo/",
    isExternal: true,
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white font-sans">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Mail className="w-3.5 h-3.5" /> Contact Us
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Get in <span className="text-gradient-primary">Touch</span>
          </h1>
          <p className="mt-6 text-slate-500 max-w-xl mx-auto text-base sm:text-lg">
            Have questions, feedback, or want to collaborate? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="glass-premium rounded-xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Contact Information</h3>

          {CONTACTS.map(({ icon: Icon, label, value, href, isExternal }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                {href ? (
                  <a
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="text-sm text-slate-700 hover:text-blue-600 transition font-medium inline-flex items-center gap-1"
                  >
                    {value}
                    {isExternal && <ExternalLink className="w-3 h-3" />}
                  </a>
                ) : (
                  <p className="text-sm text-slate-700 font-medium">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
