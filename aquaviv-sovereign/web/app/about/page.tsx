'use client';

import { FadeIn } from '@/components/ui/FadeIn';
import { ShieldCheck, Zap, Droplets, Globe, Award, Microscope } from 'lucide-react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="bg-surface-light min-h-screen">
      
      {/* HERO */}
      <section className="relative py-24 lg:py-32 bg-surface-dark text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <FadeIn>
            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">Our Philosophy</span>
            <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
              Reclaim Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Biological Sovereignty</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We are not a supplement company. We are an optimization protocol. 
              In a world of depleted soil and dead water, AquaViv restores the foundational mineral matrix your cells demand.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* THE PROBLEM / SOLUTION */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div className="relative aspect-square bg-slate-200 rounded-3xl overflow-hidden">
                {/* Replace with a real image of nature/water source later */}
                <div className="absolute inset-0 bg-gradient-to-tr from-surface-dark to-slate-800 flex items-center justify-center text-white/10">
                  <Globe size={120} />
                </div>
              </div>
            </FadeIn>
            
            <FadeIn delay={0.2} className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">The Modern Deficit</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                92% of the population is chronically deficient in essential trace minerals. 
                Modern agriculture has stripped the soil, leaving our food empty and our bodies starving for conductivity.
              </p>
              <p className="text-slate-600 leading-relaxed text-lg">
                Without minerals, hydration is impossible. You aren't just thirsty; you are biologically offline.
              </p>
              
              <div className="pt-4 grid grid-cols-2 gap-6">
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                   <h4 className="text-4xl font-black text-primary mb-1">72+</h4>
                   <p className="text-sm font-bold text-slate-500">Trace Minerals</p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                   <h4 className="text-4xl font-black text-primary mb-1">100%</h4>
                   <p className="text-sm font-bold text-slate-500">Bio-Availability</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* VALUES GRID */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">The Sovereign Standard</h2>
            <p className="text-slate-500">We do not compromise on purity. Every batch is rigorously tested for potency and safety.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             <ValueCard 
               icon={<ShieldCheck className="text-emerald-500" size={32} />}
               title="Clinical Purity"
               desc="Sourced from pristine ancient seabeds, free from modern pollutants and heavy metals."
             />
             <ValueCard 
               icon={<Zap className="text-accent" size={32} />}
               title="Ionic Power"
               desc="Minerals in their most active state. Instant cellular absorption, zero digestion required."
             />
             <ValueCard 
               icon={<Microscope className="text-primary" size={32} />}
               title="Lab Verified"
               desc="Third-party tested for purity, potency, and composition. Transparency is our currency."
             />
          </div>
        </div>
      </section>

    </main>
  );
}

function ValueCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <FadeIn className="p-8 bg-surface-light rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </FadeIn>
  )
}