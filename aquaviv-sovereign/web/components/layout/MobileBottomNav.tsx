'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, User, Search, Menu, X } from 'lucide-react'; 
import { useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/providers/CartContext'; 

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart, openCart } = useCart(); // <--- We get openCart from here
  
  // Safety check for item count
  const itemCount = cart?.totalQuantity || 0;

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 1. THE BOTTOM DECK */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
        
        {/* Dock Container */}
        {/* Note: I added 'bg-slate-900/90' as a fallback if 'surface-dark' is not in your config */}
        <div className="bg-[#102222]/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex justify-between items-center px-6 py-4 relative">
          
          <NavItem href="/" icon={<Home size={22} />} active={isActive('/')} label="Home" />
          <NavItem href="/shop" icon={<Search size={22} />} active={isActive('/shop')} label="Shop" />
          
          {/* CENTER ACTION: OPEN CART DRAWER (Changed from Link to Button) */}
          <button 
            type="button"
            onClick={openCart} // <--- THE FIX
            className="relative -top-8 group focus:outline-none"
          >
            <div className="w-16 h-16 bg-[#13ecec] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(19,236,236,0.4)] border-[6px] border-[#102222] text-[#102222] transition-transform group-hover:scale-110">
              <ShoppingCart size={26} fill="currentColor" className="relative -left-0.5" />
              
              {/* DYNAMIC BADGE */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#102222] flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </div>
          </button>

          <NavItem href="/account/dashboard" icon={<User size={22} />} active={isActive('/account/dashboard')} label="Account" />
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={clsx("flex flex-col items-center gap-1 transition-colors", isMenuOpen ? "text-[#13ecec]" : "text-slate-400")}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            <span className="text-[10px] font-medium">Menu</span>
          </button>

        </div>
      </div>

      {/* 2. THE FULL SCREEN MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="lg:hidden fixed inset-0 z-40 bg-[#102222]/95 backdrop-blur-xl pt-24 px-6 pb-32 overflow-y-auto"
          >
             <div className="flex flex-col gap-6">
                <MenuLink href="/shop" label="The Collection" onClick={() => setIsMenuOpen(false)} />
                <MenuLink href="/products/aquaviv-mineral-drops" label="Mineral Drops" onClick={() => setIsMenuOpen(false)} />
                <MenuLink href="/affiliate/login" label="Partner Program" onClick={() => setIsMenuOpen(false)} />
                <div className="h-px bg-white/10 my-2" />
                <MenuLink href="/account/login" label="Sign In" onClick={() => setIsMenuOpen(false)} />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ href, icon, active, label }: { href: string, icon: any, active: boolean, label: string }) {
  return (
    <Link href={href} className={clsx("flex flex-col items-center gap-1 transition-colors", active ? "text-[#13ecec]" : "text-slate-400 hover:text-slate-200")}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}

function MenuLink({ href, label, onClick }: { href: string, label: string, onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-2xl font-bold text-white flex items-center justify-between group">
      {label}
      <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-[#13ecec] group-hover:text-[#102222] group-hover:border-[#13ecec] transition-all">→</span>
    </Link>
  )
}