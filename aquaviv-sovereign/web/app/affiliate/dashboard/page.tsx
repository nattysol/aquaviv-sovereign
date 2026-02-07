'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { FadeIn } from '@/components/ui/FadeIn';
import { LogOut, Copy, DollarSign, TrendingUp, Users, CreditCard } from 'lucide-react';

export default function AffiliateDashboard() {
  const [affiliate, setAffiliate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 1. Check if logged in
    const affiliateId = localStorage.getItem('aquaviv_affiliate_id');
    if (!affiliateId) {
      router.push('/affiliate/login');
      return;
    }

    // 2. Fetch Data
    const fetchAffiliate = async () => {
      const query = `*[_type == "affiliate" && _id == $id][0] {
        name,
        code,
        commissionRate,
        totalEarnings,
        status
      }`;
      const data = await client.fetch(query, { id: affiliateId });
      setAffiliate(data);
      setLoading(false);
    };

    fetchAffiliate();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('aquaviv_affiliate_id');
    router.push('/affiliate/login');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`https://aquaviv.net?ref=${affiliate?.code}`);
    alert('Referral Link Copied!');
  };

  if (loading) return <div className="min-h-screen bg-[#102222] flex items-center justify-center text-[#13ecec]">Loading Command Center...</div>;

  return (
    <div className="min-h-screen bg-[#f6f8f8] text-slate-900 pb-20">
      
      {/* Header */}
      <div className="bg-[#102222] text-white pt-32 pb-12 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-2 h-2 rounded-full bg-[#13ecec] animate-pulse" />
               <span className="text-[#13ecec] text-xs font-bold uppercase tracking-wider">System Active</span>
            </div>
            <h1 className="text-4xl font-bold">Welcome, {affiliate.name}</h1>
            <p className="text-slate-400 mt-2">Partner Status: <span className="text-white font-bold capitalize">{affiliate.status}</span></p>
          </div>
          <button onClick={handleLogout} className="text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-2">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-6 lg:px-12 -mt-8">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARD 1: Earnings */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign size={100} />
              </div>
              <p className="text-slate-500 font-medium text-sm">Total Earnings</p>
              <h3 className="text-4xl font-bold text-[#102222] mt-2">${affiliate.totalEarnings?.toFixed(2) || '0.00'}</h3>
              <div className="mt-4 text-xs font-bold text-[#13ecec] bg-[#102222] inline-block px-2 py-1 rounded">
                {affiliate.commissionRate}% Commission Rate
              </div>
            </div>

            {/* CARD 2: The Code */}
            <div className="bg-[#13ecec] p-8 rounded-2xl shadow-lg shadow-[#13ecec]/20 text-[#102222] relative overflow-hidden">
              <p className="font-bold text-sm opacity-80">Your Activation Code</p>
              <h3 className="text-4xl font-black mt-1 tracking-tight">{affiliate.code}</h3>
              <button 
                onClick={copyLink}
                className="mt-6 w-full bg-[#102222] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <Copy size={16} /> Copy Referral Link
              </button>
            </div>

            {/* CARD 3: Next Payout */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                   <CreditCard size={20} />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900">Next Payout</p>
                   <p className="text-xs text-slate-500">Net-30 Schedule</p>
                 </div>
               </div>
               <div className="h-px bg-slate-100 my-4" />
               <p className="text-sm text-slate-500 leading-relaxed">
                 Payouts are processed automatically via PayPal on the 1st of every month for balances over $50.
               </p>
            </div>

          </div>
        </FadeIn>

        {/* Assets Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#102222] mb-6">Creative Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {/* Placeholders for Assets */}
             {[1,2,3,4].map((i) => (
               <div key={i} className="aspect-square bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-[#13ecec] hover:text-[#13ecec] transition-colors cursor-pointer group">
                  <TrendingUp className="w-8 h-8 mb-3 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-sm font-bold">Download Asset #{i}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}