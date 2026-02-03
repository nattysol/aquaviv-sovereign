'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Award, 
  BookOpen, 
  LogOut, 
  Package, 
  RefreshCw, 
  ChevronRight, 
  Zap, 
  ShieldCheck,
  Play,
  Lock,
  Search,
  ShoppingCart,
  User,
  MapPin,
  Truck
} from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';
import Image from 'next/image';
import clsx from 'clsx';
import Link from 'next/link';

// --- MOCK DATA (We will wire this to Shopify/Sanity next) ---
const CUSTOMER = {
  name: "Alex Sterling",
  tier: "Adept",
  points: 975,
  nextTier: 1500,
  spent: 525,
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'archive' | 'ritual' | 'library'>('overview');

  return (
    <div className="min-h-screen bg-[#f6f7f8] flex font-sans text-slate-900">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-white border-r border-slate-200 fixed h-full z-20 hidden lg:flex flex-col">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3">
             {/* Using your Logo */}
            <div className="relative w-32 h-10">
              <Image 
                src="/logo.png" 
                alt="aquaViv" 
                fill 
                className="object-contain object-left"
              />
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="Command Center" 
            isActive={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <SidebarItem 
            icon={<History size={20} />} 
            label="Ritual Archive" 
            isActive={activeTab === 'archive'} 
            onClick={() => setActiveTab('archive')} 
          />
          <SidebarItem 
            icon={<Settings size={20} />} 
            label="Ritual Control" 
            isActive={activeTab === 'ritual'} 
            onClick={() => setActiveTab('ritual')} 
          />
          <SidebarItem 
            icon={<Award size={20} />} 
            label="Sovereign Rewards" 
            isActive={false} 
            onClick={() => {}} 
          />
          <SidebarItem 
            icon={<BookOpen size={20} />} 
            label="The Library" 
            isActive={activeTab === 'library'} 
            onClick={() => setActiveTab('library')} 
          />
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              AS
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-bold truncate">{CUSTOMER.name}</p>
              <p className="text-xs text-slate-500 truncate">{CUSTOMER.tier} Status</p>
            </div>
            <button className="ml-auto text-slate-400 hover:text-red-500">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 lg:ml-72 p-4 md:p-8 lg:p-12 overflow-y-auto">
        
        {/* TAB: COMMAND CENTER (Overview) */}
        {activeTab === 'overview' && (
          <FadeIn>
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Client Command Center</h1>
              <p className="text-slate-500 mt-2">Welcome back, Alex. Your biological optimization is on track.</p>
            </header>

            <div className="grid grid-cols-12 gap-6">
              {/* Left Column */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Rewards Card */}
                <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-32 h-32 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                    <Award size={48} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <p className="text-primary font-bold text-xs uppercase tracking-widest">Current Tier</p>
                        <h4 className="text-2xl font-black text-slate-900">{CUSTOMER.tier} Status</h4>
                      </div>
                      <p className="text-slate-400 text-sm font-medium">{CUSTOMER.points} / {CUSTOMER.nextTier}</p>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-3">
                      <div className="bg-gradient-to-r from-primary to-cyan-400 h-full w-[65%]" />
                    </div>
                    <p className="text-slate-500 text-sm">
                      You are <span className="font-bold text-slate-900">${1500 - CUSTOMER.points}</span> away from unlocking <span className="text-primary font-bold">Sovereign Tier</span>.
                    </p>
                  </div>
                </section>

                {/* Algorithm of You (Recommendation) */}
                <section className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all">
                  <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 bg-gradient-to-l from-white to-transparent" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 p-2">
                      {/* Using your Shilajit Image */}
                      <img src="/shilajit.webp" alt="Shilajit" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">Next Step in Your Protocol</p>
                      <h4 className="text-2xl font-bold mb-2">Activate Cellular Rejuvenation</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        Based on your Ionic Mineral consistency, your body is ready for fulvic acid integration.
                      </p>
                    </div>
                    <button className="bg-primary hover:bg-white hover:text-slate-900 text-white font-bold py-3 px-6 rounded-lg transition-all whitespace-nowrap">
                      Add to Protocol
                    </button>
                  </div>
                </section>

              </div>

              {/* Right Column (Timeline) */}
              <div className="col-span-12 lg:col-span-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 h-full">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <History size={18} className="text-primary" /> Wellness Journey
                  </h3>
                  
                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:bg-slate-100">
                    
                    {/* Timeline Item 1 */}
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 z-10">
                        <Truck size={16} />
                      </div>
                      <div className="mb-1 flex justify-between">
                        <p className="font-bold text-sm">Order #AQV-9921</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Today</span>
                      </div>
                      <div className="h-24 bg-slate-100 rounded-lg mb-2 overflow-hidden relative">
                         <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs font-medium">Map Visualization</div>
                      </div>
                      <p className="text-xs text-slate-500">In Transit • Arriving Tomorrow by 8pm</p>
                    </div>

                    {/* Timeline Item 2 */}
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border-2 border-primary text-primary flex items-center justify-center z-10">
                        <Package size={16} />
                      </div>
                      <div className="mb-1 flex justify-between">
                        <p className="font-bold text-sm">Monthly Reset Delivered</p>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">May 12</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Your Cellular Hydration Pack arrived.</p>
                      <button className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                        Reorder <ChevronRight size={12} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* TAB: RITUAL ARCHIVE (Order History) */}
        {activeTab === 'archive' && (
          <FadeIn>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">The Archive</h1>
                <p className="text-slate-500 mt-2">Review your ritual history and track active transformations.</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600">Last 6 Months</button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Order Card 1 */}
              <div className="bg-white border border-primary/30 rounded-xl p-6 shadow-[0_0_20px_rgba(17,98,212,0.05)]">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <Truck size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">IN TRANSIT</span>
                        <h3 className="font-bold text-lg text-slate-900">Hydro-Elemental Ritual</h3>
                      </div>
                      <p className="text-sm text-slate-500">Order #AV-99212 • Placed Oct 12, 2026</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-lg border border-slate-200 font-bold text-sm hover:bg-slate-50">View Invoice</button>
                    <button className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Track Live
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Card 2 */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-primary/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-lg text-slate-400">
                      <Package size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded">DELIVERED</span>
                        <h3 className="font-bold text-lg text-slate-900">Cellular Rebirth Bundle</h3>
                      </div>
                      <p className="text-sm text-slate-500">Order #AV-88401 • Sept 15, 2026</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 rounded-lg border border-primary text-primary font-bold text-sm hover:bg-primary/5">
                      Reorder Ritual
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* TAB: RITUAL CONTROL (Subscription) */}
        {activeTab === 'ritual' && (
          <FadeIn>
            <header className="mb-8">
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Ritual Control</h1>
               <p className="text-slate-500 mt-2">Manage your subscription frequency and active products.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subscription Settings */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                   <RefreshCw className="text-primary" />
                   <h2 className="text-xl font-bold">Active Subscription</h2>
                </div>
                
                <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Frequency</label>
                     <select className="w-full h-12 rounded-lg border-slate-200 text-slate-700 focus:border-primary focus:ring-primary">
                        <option>Every 30 Days (Recommended)</option>
                        <option>Every 45 Days</option>
                        <option>Every 60 Days</option>
                     </select>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-sm">
                        Swap Product
                      </button>
                      <button className="p-4 rounded-lg border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 text-sm">
                        Pause Ritual
                      </button>
                   </div>

                   <button className="w-full h-14 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all">
                      Save Changes
                   </button>
                </div>
              </div>

              {/* Expert Tip */}
              <div className="bg-primary/5 border border-primary/10 p-8 rounded-2xl">
                 <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-full shadow-sm">
                       <ShieldCheck className="text-primary" size={24} />
                    </div>
                    <div>
                       <h3 className="font-bold text-lg text-slate-900 mb-2">Expert Tip</h3>
                       <p className="text-slate-600 leading-relaxed">
                          Most members find that a **45-day cycle** works best when alternating with the Shilajit Energy Protocol. This allows for a "washout" week to reset tolerance.
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* TAB: LIBRARY (Content) */}
        {activeTab === 'library' && (
           <FadeIn>
              <header className="mb-8">
                 <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">The Library</h1>
                 <p className="text-slate-500 mt-2">Exclusive protocols unlocked by your purchase history.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {/* Content Card 1 */}
                 <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                    <div className="h-48 bg-slate-100 relative">
                       {/* Placeholder for Video Thumbnail */}
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                             <Play size={20} fill="currentColor" />
                          </div>
                       </div>
                       <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-bold">12:45</span>
                    </div>
                    <div className="p-5">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">Shilajit Energy Protocol</h3>
                          <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-1 rounded">Unlocked</span>
                       </div>
                       <p className="text-sm text-slate-500">Master the morning mineral restoration for peak cognitive performance.</p>
                    </div>
                 </div>

                 {/* Content Card 2 (Locked) */}
                 <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden opacity-75 hover:opacity-100 transition-all">
                    <div className="h-48 bg-slate-800 relative">
                       <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white">
                             <Lock size={20} />
                          </div>
                       </div>
                    </div>
                    <div className="p-5">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">Deep Circadian Reset</h3>
                          <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-1 rounded">Locked</span>
                       </div>
                       <p className="text-sm text-slate-500">Optimizing nighttime hydration for cellular repair and REM stability.</p>
                       <p className="text-xs text-primary font-bold mt-4">Available after 3 months of ritual</p>
                    </div>
                 </div>
              </div>
           </FadeIn>
        )}

      </main>
    </div>
  );
}

// Helper Component for Sidebar
function SidebarItem({ icon, label, isActive, onClick }: { icon: any, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all",
        isActive 
          ? "bg-primary/5 text-primary font-bold" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium"
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  )
}