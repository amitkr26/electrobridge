"use client";

import { Mail, Linkedin, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 font-sans">
      {/* Hero */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Mail className="w-3.5 h-3.5" /> Contact Us
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Get in <span className="text-blue-400">Touch</span>
          </h1>
          <p className="mt-6 text-slate-400 max-w-xl mx-auto text-base sm:text-lg">
            Have questions, feedback, or want to collaborate? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white">Contact Information</h3>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email</p>
              <a href="mailto:support@electrobridge.in" className="text-sm text-white hover:text-blue-400 transition font-medium">
                support@electrobridge.in
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
              <p className="text-sm text-white">India</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <Linkedin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">LinkedIn</p>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-blue-400 transition font-medium">
                ElectroBridge
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
