'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, History, Settings, Award, BookOpen, LogOut, 
  Package, RefreshCw, ChevronRight, Zap, ShieldCheck, Play, Lock, 
  Truck, Search
} from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Helper to format currency
const formatMoney = (amount: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount));

// Helper to format date
const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

interface DashboardProps {
  customer: any; 
}

// FIX: Ensure 'export' is here, and NO import of DashboardView at the top
export function DashboardView({ customer }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'archive' | 'ritual' | 'library'>('overview');
  const router = useRouter();

  // Loyalty Logic
  const totalSpent = customer.orders.edges.reduce((acc: number, edge: any) => acc + parseFloat(edge.node.totalPrice.amount), 0);
  const points = Math.floor(totalSpent);
  
  let tier = "Initiate";
  let nextTierPoints = 500;
  if (points > 500) { tier = "Adept"; nextTierPoints = 1500; }
  if (points > 1500) { tier = "Sovereign"; nextTierPoints = 5000; }

  const latestOrder = customer.orders.edges[0]?.node;

  return (
    <div className="min-h-screen bg-[#f6f7f8] flex font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 fixed h-full z-20 hidden lg:flex flex-col">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-32 h-10">
              <Image src="/logo.svg" alt="aquaViv" fill className="object-contain object-left" />
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Command Center" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={<History size={20} />} label="Archive" isActive={activeTab === 'archive'} onClick={() => setActiveTab('archive')} />
          <SidebarItem icon={<Settings size={20} />} label="Control" isActive={activeTab === 'ritual'} onClick={() => setActiveTab('ritual')} />
          <SidebarItem icon={<Award size={20} />} label="Rewards" isActive={false} onClick={() => {}} />
          <SidebarItem icon={<BookOpen size={20} />} label="The Library" isActive={activeTab === 'library'} onClick={() => setActiveTab('library')} />
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {customer.firstName?.[0] || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-bold truncate">{customer.firstName} {customer.lastName}</p>
              <p className="text-xs text-slate-500 truncate">{tier} Status</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 lg:ml-72 p-4 md:p-8 lg:p-12 overflow-y-auto">
        
        {/* TAB: COMMAND CENTER */}
        {activeTab === 'overview' && (
          <FadeIn>
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Client Command Center</h1>
              <p className="text-slate-500 mt-2">Welcome back, {customer.firstName}. Your biological optimization is on track.</p>
            </header>

            <div className="grid grid-cols-12 gap-6">
              {/* Rewards Card */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-32 h-32 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                    <Award size={48} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-primary font-bold text-xs uppercase tracking-widest">Current Tier</p>
                        <h4 className="text-2xl font-black text-slate-900">{tier} Status</h4>
                      </div>
                      <p className="text-slate-400 text-sm font-medium">{points} / {nextTierPoints}</p>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3">
                      <div className="bg-gradient-to-r from-primary to-cyan-400 h-full transition-all duration-1000" style={{ width: `${(points / nextTierPoints) * 100}%` }} />
                    </div>
                    <p className="text-slate-500 text-sm">
                      You are <span className="font-bold text-slate-900">${(nextTierPoints - points).toFixed(0)}</span> away from unlocking <span className="text-primary font-bold">Next Tier</span>.
                    </p>
                  </div>
                </section>

                {/* Recommendation */}
                <section className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                  <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-gradient-to-l from-white to-transparent" />
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 p-2">
                      <img src="/shilajit.webp" alt="Shilajit" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">Next Step in Your Protocol</p>
                      <h4 className="text-2xl font-bold mb-2">Activate Cellular Rejuvenation</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Based on your {latestOrder ? 'recent order' : 'profile'}, your body is ready for fulvic acid integration.
                      </p>
                    </div>
                    <button className="bg-primary hover:bg-white hover:text-slate-900 text-white font-bold py-3 px-6 rounded-lg transition-all whitespace-nowrap">
                      Add to Protocol
                    </button>
                  </div>
                </section>
              </div>

              {/* Timeline / Recent Order */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 h-full">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <History size={18} className="text-primary" /> Recent Activity
                  </h3>
                  
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-slate-100">
                    {latestOrder ? (
                      <div className="relative pl-12">
                        <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 z-10">
                          <Package size={16} />
                        </div>
                        <div className="mb-1 flex justify-between">
                          <p className="font-bold text-sm">Order #{latestOrder.orderNumber}</p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">{formatDate(latestOrder.processedAt)}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{latestOrder.fulfillmentStatus === 'FULFILLED' ? 'Delivered' : 'Processing'}</p>
                        <button onClick={() => setActiveTab('archive')} className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                          View Details <ChevronRight size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative pl-12">
                         <p className="text-sm text-slate-500">No orders yet. Start your journey.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* TAB: ARCHIVE (Real Orders) */}
        {activeTab === 'archive' && (
          <FadeIn>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">The Archive</h1>
                <p className="text-slate-500 mt-2">Review your history.</p>
              </div>
            </div>

            <div className="space-y-4">
              {customer.orders.edges.map((edge: any) => {
                const order = edge.node;
                return (
                  <div key={order.orderNumber} className="bg-white border border-slate-200 rounded-xl p-6 hover:border-primary/30 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-3 rounded-lg text-slate-400">
                          <Package size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={clsx("text-[10px] font-bold px-2 py-0.5 rounded uppercase", 
                              order.fulfillmentStatus === 'FULFILLED' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                            )}>
                              {order.fulfillmentStatus || 'UNFULFILLED'}
                            </span>
                            <h3 className="font-bold text-lg text-slate-900">Order #{order.orderNumber}</h3>
                          </div>
                          <p className="text-sm text-slate-500">
                            {formatDate(order.processedAt)} • {formatMoney(order.totalPrice.amount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-5 py-2.5 rounded-lg border border-primary text-primary font-bold text-sm hover:bg-primary/5">
                          Reorder
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {customer.orders.edges.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <p>No orders found.</p>
                  <Link href="/product" className="text-primary font-bold hover:underline mt-2 inline-block">Start your first order</Link>
                </div>
              )}
            </div>
          </FadeIn>
        )}

        {/* TAB: RITUAL CONTROL (Static) */}
        {activeTab === 'ritual' && (
          <FadeIn>
             <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
                <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Subscription Management</h2>
                <p className="text-slate-500 mb-6">Manage your active subscriptions via our secure portal.</p>
                <button className="bg-primary text-white font-bold px-6 py-3 rounded-lg">Access Portal</button>
             </div>
          </FadeIn>
        )}

        {/* TAB: LIBRARY (Static) */}
        {activeTab === 'library' && (
           <FadeIn>
              <header className="mb-8">
                 <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">The Library</h1>
                 <p className="text-slate-500 mt-2">Exclusive protocols unlocked by your purchase history.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="h-48 bg-slate-100 relative flex items-center justify-center">
                        <Play size={20} className="text-primary" />
                    </div>
                    <div className="p-5">
                       <h3 className="font-bold text-lg">Shilajit Energy Protocol</h3>
                       <p className="text-sm text-slate-500">Master the morning mineral restoration.</p>
                    </div>
                 </div>
              </div>
           </FadeIn>
        )}

      </main>
    </div>
  );
}

function SidebarItem({ icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all",
        isActive ? "bg-primary/5 text-primary font-bold" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  )
}