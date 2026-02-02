import Link from 'next/link';
import { ArrowRight, Droplet, ShieldCheck, Zap, Activity } from 'lucide-react';
import { FadeIn } from '@/components/ui/FadeIn';

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
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-accent text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Clinical Grade Hydration
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Reclaim Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                  Cellular Sovereignty
                </span>
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.3}>
              <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
              Modern water is oxidizing your cells. aquaViv utilizes 9-times roasted Bamboo Salt to transform water into a bio-active, antioxidant fluid.
            </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/product" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-primary bg-accent rounded-full hover:bg-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  Shop The Ritual
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/affiliate/join" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white border border-white/20 rounded-full hover:bg-white/10 transition-all">
                  Partner Program
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 2. SOCIAL PROOF / TRUST STRIP (Restored & Animated) */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <FadeIn>
            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
              Trusted by Elite Performers & Practitioners
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
              {['Equinox', 'Huberman Lab', 'Bulletproof', 'Onnit'].map((brand) => (
                <span key={brand} className="text-xl font-bold font-serif text-slate-600">{brand}</span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 3. THE PROBLEM & SOLUTION (Grid) */}
      <section className="py-24 bg-surface-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <FadeIn delay={0.1}>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">The Depletion Crisis</h3>
                <p className="text-slate-500 leading-relaxed">
                  90% of tap and bottled water is devoid of minerals. Your body is drinking, but your cells are starving.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                {/* Updated Title */}
                <h3 className="text-xl font-bold text-primary mb-3">1/10th Molecular Size</h3>
                {/* Updated Description based on  */}
                <p className="text-slate-500 leading-relaxed">
                  Bamboo salt crystals are 1/10th the size of regular salt (300-600Å). They pass effortlessly through cell membranes for deep, instant hydration.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                {/* Updated Title */}
                <h3 className="text-xl font-bold text-primary mb-3">1,300°C Alchemical Purity</h3>
                {/* Updated Description based on [cite: 478, 521] */}
                <p className="text-slate-500 leading-relaxed">
                  Roasted 9 times and melted at 1,300°C. This ancient process eliminates all heavy metals and toxins while synthesizing bio-active sulfur.
                </p>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

     {/* 4. THE SOVEREIGN PROTOCOL (Replaces single product CTA) */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-slate-50 rounded-[100%] blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-accent font-bold tracking-widest uppercase text-xs">The Collection</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 mb-6">The Sovereign Protocol</h2>
              <p className="text-slate-500 text-lg">
                A complete system for cellular restoration. Hydrate with Minerals, elevate with Ormus, and energize with Shilajit.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            
            {/* 1. THE FOUNDATION: Minerals */}
            <FadeIn delay={0.1}>
              <Link href="/products/aquaviv-mineral-drops" className="group block">
                <div className="relative bg-surface-light rounded-2xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-primary/20 hover:-translate-y-2">
                  {/* Image Container */}
                  <div className="h-[400px] flex items-center justify-center p-8 bg-gradient-to-b from-white to-slate-50">
                    <div className="relative w-full h-full">
                       <img 
                         src="/minerals.webp" 
                         alt="Ionic Trace Minerals" 
                         className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                       />
                    </div>
                  </div>
                  
                  {/* Content Container (This was missing) */}
                  <div className="p-8">
                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">The Foundation</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">Ionic Trace Minerals</h3>
                    
                    {/* Updated Scientific Description */}
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      9-Times Roasted Bamboo Salt. [cite_start]High alkaline (pH 11.5) and strong reducing power (ORP -430mV) to reverse cellular oxidation[cite: 4, 903, 972].
                    </p>
                    
                    <div className="flex items-center text-primary font-bold text-sm">
                      Shop Ritual <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>

            {/* 2. THE ELEVATION: Ormus */}
            <FadeIn delay={0.2}>
              <Link href="/products/rose-and-gold-ormus" className="group block">
                <div className="relative bg-surface-light rounded-2xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-rose-400/30 hover:-translate-y-2">
                  <div className="h-[400px] flex items-center justify-center p-8 bg-gradient-to-b from-white to-[#fff0f5]">
                    <div className="relative w-full h-full">
                       <img 
                         src="/ormus.webp" 
                         alt="Rose & Gold Ormus" 
                         className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                       />
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">The Elevation</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-rose-500 transition-colors">Rose & Gold Ormus</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      High-spin monoatomic gold infused with organic Bulgarian rose for cognitive flow.
                    </p>
                    <div className="flex items-center text-rose-500 font-bold text-sm">
                      Fresh Batch <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>

            {/* 3. THE POWER: Shilajit */}
            <FadeIn delay={0.3}>
              <Link href="/products/pure-shilajit" className="group block"> {/* Link to # for now */}
                <div className="relative bg-surface-light rounded-2xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-slate-800/20 hover:-translate-y-2">
                  <div className="h-[400px] flex items-center justify-center p-8 bg-gradient-to-b from-white to-slate-200">
                    <div className="relative w-full h-full">
                       <img 
                         src="/shilajit.webp" 
                         alt="Pure Shilajit" 
                         className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                       />
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">The Power</div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-slate-600 transition-colors">Pure Liquid Shilajit</h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      The destroyer of weakness. 84+ minerals and fulvic acid for deep energy.
                    </p>
                    <div className="flex items-center text-slate-700 font-bold text-sm">
                      Coming Soon <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeIn>

          </div>
        </div>
      </section>

    </main>
  );
}