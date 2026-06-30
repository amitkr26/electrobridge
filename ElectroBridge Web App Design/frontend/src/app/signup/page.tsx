'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircuitBoard, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center mx-auto mb-4">
            <CircuitBoard size={20} className="text-[#00E5FF]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-sm text-[#94A3B8] mt-1">Join India&apos;s semiconductor career platform</p>
        </div>

        <div className="bg-[#1A2438] border border-[#1F2937] rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Full Name</label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl focus-within:border-[#00E5FF]/40 transition-colors">
              <User size={14} className="text-[#94A3B8]" />
              <input required className="bg-transparent text-sm text-white placeholder:text-[#94A3B8] outline-none flex-1" placeholder="Your full name" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Email</label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl focus-within:border-[#00E5FF]/40 transition-colors">
              <Mail size={14} className="text-[#94A3B8]" />
              <input type="email" required className="bg-transparent text-sm text-white placeholder:text-[#94A3B8] outline-none flex-1" placeholder="you@example.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Password</label>
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0B1120] border border-[#1F2937] rounded-xl focus-within:border-[#00E5FF]/40 transition-colors">
              <Lock size={14} className="text-[#94A3B8]" />
              <input type={showPwd ? 'text' : 'password'} required className="bg-transparent text-sm text-white placeholder:text-[#94A3B8] outline-none flex-1" placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-[#94A3B8] hover:text-white">
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button className="w-full py-3 rounded-xl bg-[#00E5FF] text-[#0B1120] font-semibold text-sm hover:bg-[#00E5FF]/90 transition-colors">
            Create Account
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#1F2937]" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-[#1A2438] px-2 text-[#94A3B8]">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-2.5 rounded-xl bg-[#0B1120] border border-[#1F2937] text-sm text-white hover:border-[#00E5FF]/30 transition-colors">Google</button>
            <button className="py-2.5 rounded-xl bg-[#0B1120] border border-[#1F2937] text-sm text-white hover:border-[#00E5FF]/30 transition-colors">GitHub</button>
          </div>

          <p className="text-xs text-[#94A3B8] text-center">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-[#00E5FF]">Terms</Link> and{' '}
            <Link href="/privacy" className="text-[#00E5FF]">Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00E5FF] hover:text-[#00E5FF]/80 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}