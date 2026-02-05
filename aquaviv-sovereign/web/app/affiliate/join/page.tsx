'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, TrendingUp, DollarSign, Image as ImageIcon, Users, ShieldCheck } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';

export default function AffiliateLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row font-sans text-slate-900">
      
      {/* LEFT SIDE: The "Sell" (Benefits) */}
      <div 
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 bg-cover bg-center text-white"
        style={{ 
          // Use a slightly different image or the same brand style
          backgroundImage: `linear-gradient(rgba(16, 34, 34, 0.85), rgba(16, 34, 34, 0.9)), url('/images/affiliate-bg.webp')`, 
          backgroundColor: '#102222' 
        }}
      >
        {/* Logo */}
        <div className="absolute top-10 left-12 xl:left-24 flex items-center gap-3">
          <div className="w-8 h-8 text-[#13ecec]">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">aquaViv <span className="opacity-50 font-normal">| Partners</span></h2>
        </div>

        {/* Value Proposition */}
        <div className="max-w-xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#13ecec]/30 bg-[#13ecec]/10 text-[#13ecec] text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              Official Partner Program
            </div>

            <h1 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-6">
              Monetize Your Influence.
            </h1>
            <p className="text-lg text-slate-300 mb-10 font-medium leading-relaxed">
              Join the movement to restore biological sovereignty. Share clinical-grade minerals and earn premium commissions.
            </p>

            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-white/20 pb-4 text-white">Program Privileges</h3>
              <div className="grid gap-5">
                <BenefitRow 
                  icon={<DollarSign />} 
                  title="20% Commission" 
                  desc="Earn generous payouts on every order you generate." 
                />
                <BenefitRow 
                  icon={<TrendingUp />} 
                  title="Real-Time Analytics" 
                  desc="Track clicks, conversions, and revenue instantly." 
                />
                <BenefitRow 
                  icon={<ImageIcon />} 
                  title="Creative Asset Library" 
                  desc="Access professional photos, videos, and scientific copy." 
                />
                <BenefitRow 
                  icon={<Users />} 
                  title="Priority Partner Support" 
                  desc="Direct line to our dedicated partnership team." 
                />
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-10 left-12 xl:left-24 text-sm text-white/40">
          © {new Date().getFullYear()} aquaViv Sovereign Wellness.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-24 bg-[#f6f8f8]">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="w-8 h-8 text-[#13ecec]">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">aquaViv Partners</h2>
        </div>

        <div className="w-full max-w-[440px] space-y-8">
          <FadeIn delay={0.1}>
            <div className="text-left">
              <h2 className="text-3xl font-extrabold text-[#0d1b1b] leading-tight">Partner Portal Login</h2>
              <p className="mt-3 text-slate-500">Access your dashboard, links, and payout history.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-[#0d1b1b] mb-2">Email Address</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="partner@example.com"
                  className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-[#0d1b1b] focus:border-[#13ecec] focus:ring-0 transition-colors placeholder:text-gray-400 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-bold text-[#0d1b1b]">Password</label>
                  <Link href="/affiliate/forgot-password" className="text-sm font-semibold text-[#13ecec] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-[#0d1b1b] focus:border-[#13ecec] focus:ring-0 transition-colors placeholder:text-gray-400 outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-[#0d1b1b] py-4 text-base font-bold text-white shadow-lg shadow-black/10 hover:bg-slate-800 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {/* Note: Button is Dark for Affiliate to distinguish from Customer Login */}
                {isLoading ? 'Verifying Partner...' : 'Access Portal'}
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm font-medium uppercase tracking-wider">
                <span className="bg-[#f6f8f8] px-4 text-gray-400">Not a partner yet?</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/affiliate/apply" className="inline-flex items-center gap-2 text-base font-bold text-[#0d1b1b] hover:text-[#13ecec] transition-colors group">
                Apply to Program
                <ArrowRight className="w-5 h-5 text-[#13ecec] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>
        
      </div>
    </div>
  );
}

// Helper: Specific Row Design for Affiliates
function BenefitRow({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="shrink-0 w-12 h-12 rounded-xl bg-[#13ecec]/10 flex items-center justify-center text-[#13ecec] group-hover:bg-[#13ecec] group-hover:text-[#0d1b1b] transition-all duration-300">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-bold text-lg group-hover:text-[#13ecec] transition-colors">{title}</h4>
        <p className="text-slate-400 text-sm leading-snug">{desc}</p>
      </div>
    </div>
  );
}