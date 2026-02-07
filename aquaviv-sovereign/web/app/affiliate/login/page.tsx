'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

export default function AffiliateLogin() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // SIMULATION: Set a fake session and redirect to the dashboard
    setTimeout(() => {
      localStorage.setItem('aquaviv_affiliate_id', 'simulated_id_123');
      router.push('/affiliate/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f8] flex flex-col items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#102222] text-[#13ecec] mb-4">
            <Lock size={20} />
          </div>
          <h1 className="text-2xl font-black text-[#102222]">Partner Access</h1>
          <p className="text-slate-500 mt-2 text-sm">Enter your credentials to access the command center.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none text-slate-900 transition-colors" 
              placeholder="partner@example.com" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-[#13ecec] outline-none text-slate-900 transition-colors" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-[#102222] text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Verifying...' : 'Enter Dashboard'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-slate-100">
          <p className="text-sm text-slate-500">Not a partner yet?</p>
          <Link href="/affiliate/apply" className="text-[#102222] font-bold text-sm hover:text-[#13ecec] transition-colors mt-1 block">
            Apply for the Program &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}