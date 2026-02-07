'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ChevronRight, Zap, Moon, Sparkles, Droplet, 
  ShoppingCart, Check, FlaskConical, Leaf, Truck, ArrowRight
} from 'lucide-react';
import { useCart } from '@/components/providers/CartContext';

// --- DATA: The Options ---
const GOALS = [
  { id: 'energy', label: 'Peak Energy', sub: 'Maximize daily vitality', icon: <Zap size={32} /> },
  { id: 'sleep', label: 'Deep Recovery', sub: 'Rest and cellular repair', icon: <Moon size={32} /> },
  { id: 'focus', label: 'Mental Clarity', sub: 'Sharpen cognitive focus', icon: <Sparkles size={32} /> },
  { id: 'skin', label: 'Skin & Glow', sub: 'Hydrate from within', icon: <Droplet size={32} /> },
];

export default function QuizPage() {
  const [step, setStep] = useState<'question' | 'results'>('question');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const { addToCart, openCart } = useCart();
  const [adding, setAdding] = useState(false);

  // --- LOGIC: Handle Selection ---
  const handleSelect = (id: string) => {
    setSelectedGoal(id);
    // Add a small delay for effect before showing results
    setTimeout(() => {
      setStep('results');
      window.scrollTo(0, 0);
    }, 400);
  };

  // --- LOGIC: Add Result to Cart ---
  const handleAddToCart = async () => {
    setAdding(true);
    // NOTE: In a real app, map 'selectedGoal' to specific variant IDs.
    // For now, we use a placeholder ID or the main product ID.
    const productVariantId = "42958057930818"; 
    
    await addToCart(productVariantId, 1);
    setAdding(false);
    openCart(); // Open the drawer to confirm
  };

  return (
    <div className="min-h-screen font-sans bg-[#f6f6f8] dark:bg-[#101622] text-[#0d121b] dark:text-white transition-colors duration-300">
      
      {/* --- STEP 1: QUESTION --- */}
      {step === 'question' && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="relative min-h-screen flex flex-col"
        >
          {/* Progress Bar */}
          <div className="fixed top-0 left-0 w-full h-1.5 bg-[#cfd7e7] dark:bg-gray-800 z-50">
             <motion.div 
               initial={{ width: 0 }} animate={{ width: "25%" }} 
               className="h-full bg-[#1152d4] dark:bg-[#13ecec]" 
             />
          </div>

          {/* Header */}
          <header className="flex items-center justify-between px-6 py-8 w-full">
            <Link href="/" className="group flex items-center gap-2 text-[#1152d4] dark:text-[#13ecec] font-semibold hover:opacity-80 transition-opacity">
              <ArrowLeft size={24} />
              <span className="hidden md:inline">Back</span>
            </Link>
            <div className="flex flex-col items-end">
              <p className="text-xs font-bold uppercase tracking-widest text-[#1152d4]/60 dark:text-[#13ecec]/60">Step 01</p>
              <p className="text-sm font-medium text-[#4c669a] dark:text-gray-400">Personalization Quiz</p>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full pb-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
                What is your primary <br className="hidden md:block"/> 
                <span className="text-[#1152d4] dark:text-[#13ecec]">wellness focus?</span>
              </h1>
              <p className="text-[#4c669a] dark:text-gray-400 text-lg">Select one to begin your aquaViv journey</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => handleSelect(goal.id)}
                  className={`relative p-8 rounded-xl border transition-all duration-300 flex items-center gap-6 text-left group
                    ${selectedGoal === goal.id 
                      ? 'bg-white dark:bg-[#1a2c42] border-[#1152d4] dark:border-[#13ecec] shadow-lg scale-[1.02]' 
                      : 'bg-white/40 dark:bg-white/5 border-white/50 dark:border-white/10 hover:-translate-y-1 hover:bg-white/60 dark:hover:bg-white/10'
                    }
                  `}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300
                    ${selectedGoal === goal.id 
                      ? 'bg-[#1152d4] dark:bg-[#13ecec] text-white dark:text-[#101622]' 
                      : 'bg-[#1152d4]/10 dark:bg-[#13ecec]/20 text-[#1152d4] dark:text-[#13ecec] group-hover:bg-[#1152d4] dark:group-hover:bg-[#13ecec] group-hover:text-white dark:group-hover:text-[#101622]'
                    }
                  `}>
                    {goal.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{goal.label}</h3>
                    <p className="text-sm text-[#4c669a] dark:text-gray-400">{goal.sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </main>

          {/* Footer (Skip) */}
          <footer className="fixed bottom-0 left-0 w-full p-8 flex justify-end items-center pointer-events-none">
            <Link href="/shop" className="pointer-events-auto px-8 py-3 bg-white dark:bg-[#101622] border border-[#1152d4]/20 dark:border-[#13ecec]/20 text-[#1152d4] dark:text-[#13ecec] font-bold rounded-full hover:bg-[#1152d4] dark:hover:bg-[#13ecec] hover:text-white dark:hover:text-[#101622] transition-all shadow-lg flex items-center gap-2">
               Skip <ChevronRight size={16} />
            </Link>
          </footer>

          {/* Background Blobs */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#1152d4]/5 dark:bg-[#13ecec]/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#e0f7fa]/40 dark:bg-[#13ecec]/5 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>
      )}


      {/* --- STEP 2: RESULTS --- */}
      {step === 'results' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex flex-col"
        >
          {/* Result Header */}
          <header className="w-full px-6 lg:px-20 py-6 flex items-center justify-between border-b border-[#e7f3f3] dark:border-[#1e3a3a] bg-white/50 dark:bg-[#102222]/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-3">
               <div className="text-[#13ecec] size-8 font-black tracking-widest flex items-center">AV</div>
               <h1 className="text-xl font-extrabold tracking-tight">aquaViv</h1>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={openCart} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                 <ShoppingCart size={24} />
               </button>
            </div>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto px-6 py-12 lg:py-20">
            {/* Header Text */}
            <div className="w-full text-center mb-12 lg:mb-16">
               <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#13ecec]/10 text-[#13ecec] dark:text-[#13ecec] text-xs font-bold uppercase tracking-widest mb-4">
                  <Check size={14} /> Analysis Complete
               </span>
               <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                  Your Custom Protocol <br className="hidden lg:block"/> is Ready.
               </h2>
            </div>

            {/* The Product Card */}
            <div className="w-full grid lg:grid-cols-2 gap-0 overflow-hidden rounded-3xl bg-white dark:bg-[#152e2e] shadow-2xl border border-white dark:border-[#1e3a3a]">
               
               {/* Left: Image */}
               <div className="relative min-h-[400px] lg:min-h-[600px] bg-gradient-to-br from-[#13ecec]/10 to-transparent flex items-center justify-center p-12 overflow-hidden">
                  {/* Decorative Blurs */}
                  <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-[#13ecec] blur-3xl opacity-20" />
                  <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-[#13ecec] blur-[100px] opacity-20" />
                  
                  {/* Product Image Placeholder */}
                  <div className="relative z-10 w-full max-w-md aspect-[4/5] bg-contain bg-center bg-no-repeat transition-transform hover:scale-105 duration-700">
                     {/* Replace with actual Product Image Component */}
                     <div className="w-full h-full bg-[#102222]/5 dark:bg-black/20 rounded-2xl flex items-center justify-center">
                        <span className="text-[#13ecec] font-bold">PRODUCT IMAGE</span>
                     </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/80 dark:bg-black/40 backdrop-blur-md p-6 rounded-2xl flex items-center justify-between border border-white/20">
                     <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#13ecec] mb-1">Recommended Formula</p>
                        <h3 className="text-xl font-bold">Ionic Minerals No. 04</h3>
                     </div>
                     <div className="flex items-center gap-1 text-[#13ecec]">
                        <Zap size={16} fill="currentColor" />
                        <span className="text-sm font-bold">100% Match</span>
                     </div>
                  </div>
               </div>

               {/* Right: Content */}
               <div className="p-8 lg:p-16 flex flex-col justify-center">
                  <div className="max-w-md">
                     <h3 className="text-3xl font-extrabold mb-6 flex items-center gap-3">
                        The Protocol of You
                        <span className="h-px flex-1 bg-gradient-to-r from-[#13ecec]/40 to-transparent" />
                     </h3>
                     <p className="text-[#4c9a9a] dark:text-gray-300 text-lg leading-relaxed mb-8">
                        Based on your activity levels and metabolic profile, your body requires specific intracellular support. 
                        This product matches your <strong className="text-[#0d1b1b] dark:text-white font-bold">
                          '{GOALS.find(g => g.id === selectedGoal)?.label || 'Wellness'}'
                        </strong> goal perfectly by providing optimal electrolyte balance and pure cellular hydration.
                     </p>

                     {/* Tags */}
                     <div className="flex flex-wrap gap-3 mb-12">
                        <div className="flex items-center gap-2 rounded-full bg-[#e7f3f3] dark:bg-[#1e3a3a] px-4 py-2 border border-[#d1eaea] dark:border-[#2a4d4d]">
                           <Droplet size={18} className="text-[#13ecec]" />
                           <p className="text-sm font-bold">Electrolyte Balance</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-[#e7f3f3] dark:bg-[#1e3a3a] px-4 py-2 border border-[#d1eaea] dark:border-[#2a4d4d]">
                           <Zap size={18} className="text-[#13ecec]" />
                           <p className="text-sm font-bold">Peak Energy</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-[#e7f3f3] dark:bg-[#1e3a3a] px-4 py-2 border border-[#d1eaea] dark:border-[#2a4d4d]">
                           <Check size={18} className="text-[#13ecec]" />
                           <p className="text-sm font-bold">Pure Source</p>
                        </div>
                     </div>

                     {/* CTA */}
                     <div className="space-y-6">
                        <button 
                          onClick={handleAddToCart}
                          disabled={adding}
                          className="w-full bg-[#13ecec] text-[#0d1b1b] h-16 rounded-xl font-black text-lg tracking-wide shadow-xl shadow-[#13ecec]/30 hover:shadow-[#13ecec]/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group disabled:opacity-70"
                        >
                           {adding ? 'Adding...' : 'Add Protocol to Cart'}
                           {!adding && <ArrowRight className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                        
                        <div className="flex flex-col items-center gap-4">
                           <button onClick={() => setStep('question')} className="text-[#0d1b1b] dark:text-white text-sm font-bold underline underline-offset-4 decoration-[#13ecec] decoration-2 hover:text-[#13ecec] transition-colors">
                              Retake Quiz
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-20 w-full grid md:grid-cols-3 gap-8">
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="p-3 rounded-lg bg-[#13ecec]/20 text-[#13ecec]"><FlaskConical /></div>
                  <div><h4 className="font-bold mb-1">Lab Tested</h4><p className="text-sm text-[#4c9a9a] dark:text-gray-400">Purity and potency guaranteed by third-party testing.</p></div>
               </div>
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="p-3 rounded-lg bg-[#13ecec]/20 text-[#13ecec]"><Leaf /></div>
                  <div><h4 className="font-bold mb-1">Eco Conscious</h4><p className="text-sm text-[#4c9a9a] dark:text-gray-400">Sustainably sourced and packaged in recyclable glass.</p></div>
               </div>
               <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/30 dark:bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="p-3 rounded-lg bg-[#13ecec]/20 text-[#13ecec]"><Truck /></div>
                  <div><h4 className="font-bold mb-1">Fast Shipping</h4><p className="text-sm text-[#4c9a9a] dark:text-gray-400">Delivered to your door in carbon-neutral packaging.</p></div>
               </div>
            </div>

          </main>
        </motion.div>
      )}

    </div>
  );
}