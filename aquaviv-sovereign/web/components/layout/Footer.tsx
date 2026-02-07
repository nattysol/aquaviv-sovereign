'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-[#102222] text-white pt-24 pb-12 px-6 lg:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
        
        {/* Brand Column */}
        <div className="md:col-span-4">
           <h2 className="text-2xl font-black tracking-tighter mb-6 text-[#13ecec]">AQUAVIV</h2>
           <p className="text-slate-400 leading-relaxed mb-8 max-w-sm">
             Sovereign hydration for the modern biologist. Pure, ionic minerals harvested from the pristine depths.
           </p>
           {/* Form */}
           <div className="max-w-xs">
              <p className="text-xs font-bold uppercase tracking-widest mb-3 text-white">Join the Ritual</p>
              <form onSubmit={handleSubscribe} className="relative">
                 <input 
                   type="email" 
                   placeholder="email@address.com" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   disabled={status === 'success' || status === 'loading'}
                   className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-[#13ecec] transition-colors placeholder:text-slate-600"
                 />
                 <button 
                   disabled={status === 'success' || status === 'loading'}
                   className="absolute right-1 top-1 p-2 bg-[#13ecec] text-[#102222] rounded-md hover:bg-white transition-colors disabled:opacity-50"
                 >
                   {status === 'success' ? <Check size={16} /> : <ArrowRight size={16} />}
                 </button>
              </form>
              {status === 'success' && <p className="text-[#13ecec] text-xs mt-2 font-bold">Welcome to the inner circle.</p>}
              {status === 'error' && <p className="text-red-400 text-xs mt-2">Something went wrong. Try again.</p>}
           </div>
        </div>

        {/* Links Columns */}
        <div className="md:col-span-2">
           <h3 className="font-bold mb-6">Shop</h3>
           <ul className="space-y-4 text-slate-400 text-sm">
             <li><Link href="/products/ionic-minerals" className="hover:text-[#13ecec]">Mineral Drops</Link></li>
             <li><Link href="/collections/all" className="hover:text-[#13ecec]">Bundles</Link></li>
             <li><Link href="/merch" className="hover:text-[#13ecec]">Equipment</Link></li>
           </ul>
        </div>
        <div className="md:col-span-2">
           <h3 className="font-bold mb-6">Company</h3>
           <ul className="space-y-4 text-slate-400 text-sm">
             <li><Link href="/science" className="hover:text-[#13ecec]">Our Science</Link></li>
             <li><Link href="/about" className="hover:text-[#13ecec]">Manifesto</Link></li>
             <li><Link href="/contact" className="hover:text-[#13ecec]">Contact</Link></li>
           </ul>
        </div>
        <div className="md:col-span-2">
           <h3 className="font-bold mb-6">Partners</h3>
           <ul className="space-y-4 text-slate-400 text-sm">
             <li><Link href="/affiliate/login" className="hover:text-[#13ecec]">Affiliate Login</Link></li>
             <li><Link href="/affiliate/apply" className="hover:text-[#13ecec]">Apply to Partner</Link></li>
           </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
        <p>&copy; {new Date().getFullYear()} aquaViv Hydration. All rights reserved.</p>
        <div className="flex gap-6">
           <Link href="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
           <Link href="/terms" className="hover:text-slate-400">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}