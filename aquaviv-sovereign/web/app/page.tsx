import Link from 'next/link';
import { ArrowRight, Droplet, ShieldCheck, Zap, Activity } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-surface-dark text-white pt-24 pb-32 overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-primary rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[600px] h-[600px] bg-accent rounded-full blur-3xl opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-accent text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Clinical Grade Hydration
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Reclaim Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Cellular Sovereignty
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
              Modern water is dead. aquaViv restores the mineral matrix your biology demands. 
              Experience the difference of true cellular absorption.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/product" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary bg-accent rounded-full hover:bg-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                Shop The Ritual
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/affiliate/join" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all">
                Partner Program
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF / TRUST STRIP */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
            Trusted by Elite Performers & Practitioners
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
            {/* Placeholder Logos */}
            {['Equinox', 'Huberman Lab', 'Bulletproof', 'Onnit'].map((brand) => (
              <span key={brand} className="text-xl font-bold font-serif text-slate-600">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. THE PROBLEM & SOLUTION (Grid) */}
      <section className="py-24 bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-6">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">The Depletion Crisis</h3>
              <p className="text-slate-500 leading-relaxed">
                90% of tap and bottled water is devoid of minerals. Your body is drinking, but your cells are starving.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Electric Bio-Availability</h3>
              <p className="text-slate-500 leading-relaxed">
                Our ionic mineral complex conducts electricity instantly, restoring energy and focus within minutes.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Pure Sovereignty</h3>
              <p className="text-slate-500 leading-relaxed">
                Sourced from ancient inland seabeds, free from modern pollutants, microplastics, and government additives.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCT CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-3xl overflow-hidden relative text-white">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-12 md:p-20">
              <div>
                <h2 className="text-4xl font-bold mb-6">Ready to upgrade your biology?</h2>
                <p className="text-primary-100 text-lg mb-8 max-w-md">
                  Start the 30-day hydration protocol. Feel the difference in energy, skin clarity, and cognitive function.
                </p>
                <Link href="/product" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary bg-white rounded-full hover:bg-accent hover:text-primary transition-colors">
                  Shop aquaViv Drops
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 animate-pulse-slow">
                   <Droplet className="w-24 h-24 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}