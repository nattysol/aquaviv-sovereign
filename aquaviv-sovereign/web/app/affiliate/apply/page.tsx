'use client';

import { useState } from 'react';
import { client } from '@/sanity/lib/client';
import { FadeIn } from '@/components/ui/FadeIn';

export default function AffiliateApply() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // In a real app, you'd use a Server Action or API Route to write to Sanity securely.
    // For this MVP, we simulate the success message.
    // To make this functional, you need a write token in an API route.
    setTimeout(() => setStatus('success'), 1500);
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#102222] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-[#13ecec] mb-4">Application Received.</h1>
        <p className="text-slate-400 max-w-md">Our team is reviewing your profile. You will receive an activation email within 24 hours.</p>
        <a href="/" className="mt-8 text-white underline hover:text-[#13ecec]">Return Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8f8] pt-32 pb-24 px-4">
      <div className="max-w-xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black text-[#102222]">Join the aquaViv Alliance</h1>
            <p className="text-slate-500 mt-4 text-lg">Earn 20% recurring commissions by sharing the source.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-2xl shadow-xl space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Full Name</label>
              <input required type="text" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Email Address</label>
              <input required type="email" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none" placeholder="john@example.com" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Social Handle / Website</label>
              <input required type="text" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none" placeholder="@instagram" />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">Why do you want to partner?</label>
              <textarea required rows={4} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none" placeholder="Tell us your story..." />
            </div>

            <button disabled={status === 'submitting'} type="submit" className="w-full py-4 bg-[#102222] text-white font-bold rounded-xl hover:bg-black transition-all">
              {status === 'submitting' ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </FadeIn>
      </div>
    </div>
  );
}