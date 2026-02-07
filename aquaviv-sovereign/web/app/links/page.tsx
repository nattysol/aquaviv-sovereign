'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Check, ArrowRight, PlayCircle, MessageCircle, Star, 
  HelpCircle, Mail, Leaf, Camera, ArrowUp, ChevronLeft, Info, X
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function SocialHubPage() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col items-center bg-[#f6f8f8] dark:bg-[#102222] transition-colors duration-300 font-sans">
      
      {/* 1. BACKGROUND GLOW EFFECTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#13ecec]/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#13ecec]/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[540px] px-6 py-12 flex flex-col gap-6">
        
        {/* 2. HEADER */}
        <header className="flex flex-col items-center gap-4 text-center mb-4">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-[#13ecec] rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative size-28 rounded-full border-4 border-white dark:border-[#102222] shadow-xl overflow-hidden bg-slate-100">
               {/* Replace with your actual Logo/Profile Image */}
               <div className="w-full h-full bg-[#102222] flex items-center justify-center text-[#13ecec]">
                  <span className="font-bold text-xs tracking-widest">AQUAVIV</span>
               </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-[#13ecec] text-[#0d1b1b] rounded-full p-1 border-2 border-white dark:border-[#102222] flex items-center justify-center">
              <Check size={14} strokeWidth={4} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0d1b1b] dark:text-white">aquaViv</h1>
            <p className="text-[#4c9a9a] font-medium text-lg">Hydration, Evolved.</p>
          </div>
        </header>

        {/* 3. CARD STACK */}
        <main className="flex flex-col gap-4">
          
          {/* A. HERO: SHOP COLLECTION */}
          <Link href="/shop" className="group relative block h-40 w-full overflow-hidden rounded-2xl bg-[#13ecec] shadow-lg hover:scale-[1.02] transition-transform duration-300">
            {/* Background Image Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#13ecec] to-[#0d9d9d] opacity-100" />
            <div className="absolute inset-0 bg-black/10" />
            
            <div className="relative h-full flex items-end justify-between p-6">
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0d1b1b]/60 mb-1">New Drop</span>
                <h2 className="text-2xl font-extrabold text-[#0d1b1b]">Shop the Collection</h2>
              </div>
              <div className="bg-white/90 p-3 rounded-full text-[#0d1b1b] group-hover:translate-x-1 transition-transform shadow-sm">
                <ArrowRight size={20} strokeWidth={3} />
              </div>
            </div>
          </Link>

          {/* B. VIDEO: MINERAL SCIENCE */}
          <Link href="/science" className="group flex items-center gap-4 rounded-2xl bg-[#082f2f] p-5 text-white shadow-lg relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
             <div className="absolute right-0 top-0 w-32 h-32 bg-[#13ecec]/10 rounded-full -mr-16 -mt-16 blur-xl" />
             <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#13ecec]/20 flex items-center justify-center border border-[#13ecec]/30">
               <PlayCircle size={32} className="text-[#13ecec] fill-[#13ecec]/20" />
             </div>
             <div className="flex flex-col grow">
               <h3 className="text-lg font-bold">The Mineral Science</h3>
               <p className="text-[#13ecec]/70 text-sm">Deep-sea education series</p>
             </div>
          </Link>

          {/* C. INTERACTIVE: CONTACT SUPPORT (Triggers Overlay) */}
          <button 
            onClick={() => setShowChat(true)}
            className="relative group flex items-center gap-4 rounded-2xl bg-white dark:bg-[#1a3a3a] p-5 shadow-sm border-2 border-[#13ecec] hover:scale-[1.02] transition-transform duration-300 text-left w-full"
          >
             {/* Glow Effect behind the button */}
             <div className="absolute -inset-1 bg-[#13ecec]/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
             
             <div className="relative flex-shrink-0 w-14 h-14 rounded-full bg-[#13ecec] flex items-center justify-center">
               <MessageCircle size={24} className="text-[#0d1b1b] fill-current" />
             </div>
             <div className="relative flex flex-col grow">
               <h3 className="text-lg font-bold text-[#0d1b1b] dark:text-white">Contact Support</h3>
               <p className="text-[#13ecec] font-bold text-sm flex items-center gap-2">
                 <span className="relative flex h-2 w-2">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13ecec] opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-2 w-2 bg-[#13ecec]"></span>
                 </span>
                 Active Session
               </p>
             </div>
          </button>

          {/* D. REWARDS */}
          <Link href="/account/dashboard" className="group flex items-center gap-4 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-md p-5 shadow-sm border border-white/20 hover:scale-[1.02] transition-transform duration-300">
             <div className="flex-shrink-0 w-14 h-14 rounded-full bg-[#13ecec]/10 flex items-center justify-center">
               <Star size={24} className="text-[#4c9a9a] fill-current" />
             </div>
             <div className="flex flex-col grow">
               <h3 className="text-lg font-bold text-[#0d1b1b] dark:text-white">Sovereign Rewards</h3>
               <p className="text-slate-500 text-sm">Unlock exclusive benefits (Free)</p>
             </div>
          </Link>

        </main>

        {/* 4. FOOTER */}
        <footer className="mt-8 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4">
              {/* Social Icons */}
              {['Instagram', 'Twitter', 'TikTok'].map((social, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-[#13ecec] hover:text-[#102222] transition-colors cursor-pointer text-[#0d1b1b] dark:text-white">
                  <span className="text-[10px] font-bold">{social[0]}</span>
                </div>
              ))}
           </div>
           
           <p className="text-xs text-[#4c9a9a]/60">© {new Date().getFullYear()} aquaViv. All Rights Reserved.</p>
        </footer>

      </div>

      {/* 5. IOS CHAT OVERLAY */}
      <AnimatePresence>
        {showChat && (
          <>
            {/* Dim Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="fixed inset-0 bg-[#102222]/40 backdrop-blur-sm z-40"
            />
            
            {/* The Messenger Window */}
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-6 w-[95%] max-w-[400px] h-[80vh] bg-[#fff] dark:bg-[#1c2a2a] rounded-[2.5rem] z-50 flex flex-col shadow-2xl overflow-hidden border border-white/20 left-1/2 -translate-x-1/2"
            >
               {/* iOS Header */}
               <div className="bg-white/80 dark:bg-[#1c2a2a]/80 backdrop-blur-md border-b border-black/5 dark:border-white/5 px-6 py-4 flex flex-col items-center relative z-10">
                  <div className="flex items-center justify-between w-full">
                     <button onClick={() => setShowChat(false)} className="text-[#007aff] flex items-center">
                       <ChevronLeft size={24} /> 
                     </button>
                     <div className="flex flex-col items-center">
                        <div className="size-10 rounded-full border border-[#13ecec] overflow-hidden mb-1">
                           <div className="w-full h-full bg-[#102222] flex items-center justify-center">
                              <span className="text-[#13ecec] text-[8px] font-bold tracking-widest">AV</span>
                           </div>
                        </div>
                        <span className="text-[11px] font-bold text-gray-500 dark:text-[#13ecec]/60 uppercase tracking-tighter">aquaViv Support</span>
                     </div>
                     <Info size={24} className="text-[#007aff]" />
                  </div>
                  <h4 className="text-sm font-bold text-[#0d1b1b] dark:text-white mt-1">The Ritual Concierge</h4>
               </div>

               {/* Messages Area */}
               <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-white dark:bg-[#1c2a2a]">
                  <div className="text-center pt-2">
                     <span className="text-[11px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-widest">Today 10:42 AM</span>
                  </div>
                  
                  {/* Message 1 (Bot - Gray) */}
                  <div className="self-start max-w-[85%] bg-[#e9e9eb] dark:bg-[#3a3a3c] text-black dark:text-white px-4 py-2.5 rounded-[1.2rem] rounded-bl-sm text-sm leading-tight">
                     Welcome to the Ritual. Need help with your order or protocol?
                  </div>

                  {/* Message 2 (User - Blue) */}
                  <div className="flex flex-col items-end gap-1 self-end max-w-[85%]">
                     <div className="bg-[#007aff] text-white px-4 py-2.5 rounded-[1.2rem] rounded-br-sm text-sm leading-tight shadow-sm">
                        Hi! I'm interested in the Mineral Science series.
                     </div>
                     <span className="text-[10px] text-gray-400 mr-1">Delivered</span>
                  </div>

                  {/* Typing Indicator */}
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-[#e9e9eb] dark:bg-[#3a3a3c] w-fit rounded-[1.2rem] rounded-bl-sm">
                     <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100" />
                     <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
               </div>

               {/* Input Area */}
               <div className="p-4 bg-white dark:bg-[#1c2a2a] border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 bg-[#f2f2f7] dark:bg-white/5 rounded-full px-4 py-2 border border-black/5 dark:border-white/10">
                     <Camera size={20} className="text-gray-400 dark:text-white/40" />
                     <input 
                       type="text" 
                       placeholder="iMessage"
                       className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-0 text-black dark:text-white placeholder-gray-400 outline-none"
                     />
                     <div className="size-7 bg-[#007aff] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-600 transition-colors">
                        <ArrowUp size={14} strokeWidth={3} />
                     </div>
                  </div>
                  <div className="h-2"></div>
               </div>

               {/* Home Indicator */}
               <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 dark:bg-white/20 rounded-full pointer-events-none" />

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}