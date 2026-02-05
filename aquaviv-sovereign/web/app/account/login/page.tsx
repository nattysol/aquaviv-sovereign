'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, ArrowRight, Activity, Library, Award, Calendar } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row font-sans text-slate-900">
      
      {/* LEFT SIDE: Visual & Value Prop */}
      <div 
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-24 bg-cover bg-center text-white"
        style={{ 
          backgroundImage: `linear-gradient(rgba(16, 34, 34, 0.8), rgba(16, 34, 34, 0.8)), url('/images/login-bg.webp')`,
          // Note: Make sure to upload a 'login-bg.webp' to your /public/images folder
          // Or use a placeholder color if image is missing: backgroundColor: '#102222'
        }}
      >
        {/* Logo */}
        <div className="absolute top-10 left-12 xl:left-24 flex items-center gap-3">
          <div className="w-8 h-8 text-[#13ecec]">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">aquaViv</h2>
        </div>

        {/* Content */}
        <div className="max-w-xl">
          <FadeIn>
            <h1 className="text-5xl xl:text-6xl font-black leading-tight tracking-tight mb-8">
              Unlock Your Sovereign Dashboard
            </h1>
            <p className="text-lg text-[#13ecec] mb-10 font-medium">
              Experience the pinnacle of cellular hydration and revitalization.
            </p>

            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-white/20 pb-4">What&apos;s Inside</h3>
              <div className="grid gap-5">
                <FeatureRow icon={<Activity />} text="Personal Wellness Timeline" />
                <FeatureRow icon={<Library />} text="Exclusive Protocol Library" />
                <FeatureRow icon={<Award />} text="Sovereign Rewards & Tiers" />
                <FeatureRow icon={<Calendar />} text="Ritual Control (Easy Subscriptions)" />
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="absolute bottom-10 left-12 xl:left-24 text-sm text-white/60">
          © {new Date().getFullYear()} aquaViv Sovereign Wellness. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-24 bg-[#f6f8f8]">
        
        {/* Mobile Header Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-12">
          <div className="w-8 h-8 text-[#13ecec]">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">aquaViv</h2>
        </div>

        <div className="w-full max-w-[440px] space-y-8">
          <FadeIn delay={0.1}>
            <div className="text-left">
              <h2 className="text-3xl font-extrabold text-[#0d1b1b] leading-tight">Welcome Back to the Ritual</h2>
              <p className="mt-3 text-slate-500">Enter your credentials to access your sovereign space.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-[#0d1b1b] mb-2">Email Address</label>
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  className="block w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-[#0d1b1b] focus:border-[#13ecec] focus:ring-0 transition-colors placeholder:text-gray-400 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" classNa="block text-sm font-bold text-[#0d1b1b]">Password</label>
                  <Link href="/forgot-password" className="text-sm font-semibold text-[#13ecec] hover:underline">
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

              <div className="flex items-center gap-3">
                <input 
                  id="remember" 
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 text-[#13ecec] focus:ring-[#13ecec]"
                />
                <label htmlFor="remember" className="text-sm font-medium text-gray-600">Keep me signed in</label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-lg bg-[#13ecec] py-4 text-base font-bold text-[#0d1b1b] shadow-lg shadow-[#13ecec]/20 hover:bg-[#13ecec]/90 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Accessing Ritual...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm font-medium uppercase tracking-wider">
                <span className="bg-[#f6f8f8] px-4 text-gray-400">New to aquaViv?</span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/register" className="inline-flex items-center gap-2 text-base font-bold text-[#0d1b1b] hover:text-[#13ecec] transition-colors group">
                Create an Account
                <ArrowRight className="w-5 h-5 text-[#13ecec] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Mobile Footer */}
        <div className="lg:hidden mt-12 pt-8 border-t border-gray-200 w-full flex justify-between text-xs text-gray-400">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>

      </div>
    </div>
  );
}

// Helper Component for the Left Side Features
function FeatureRow({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="text-[#13ecec] group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <p className="text-lg font-normal group-hover:text-[#13ecec] transition-colors">{text}</p>
    </div>
  );
}