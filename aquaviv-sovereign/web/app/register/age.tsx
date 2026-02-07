'use client';

import Link from 'next/link';
import { FadeIn } from '@/components/ui/FadeIn';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#f6f8f8] flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-md w-full bg-white p-8 md:p-12 rounded-2xl shadow-xl">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#102222]">Begin Your Ritual</h1>
            <p className="text-slate-500 mt-2">Create an account to track your orders and subscriptions.</p>
          </div>

          <form className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#13ecec]" />
                <input type="text" placeholder="Last Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#13ecec]" />
             </div>
             <input type="email" placeholder="Email Address" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#13ecec]" />
             <input type="password" placeholder="Password" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#13ecec]" />
             
             <button type="button" onClick={() => alert("For this demo, please use Guest Checkout or Shopify's default login.")} className="w-full py-4 bg-[#13ecec] text-[#102222] font-bold rounded-lg hover:brightness-105 transition-all">
               Create Account
             </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500">
            Already have an account? <Link href="/account/login" className="text-[#102222] font-bold underline">Sign In</Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}