'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, User, Search, Menu, X } from 'lucide-react'; // Changed ShoppingBag to ShoppingCart
import { useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '@/components/providers/CartContext'; // <--- IMPORT HOOK

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount } = useCart(); // <--- GRAB THE COUNT

  // Helper to check active state
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 1. THE BOTTOM DECK */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        
        {/* Updated: /60 Opacity for glass effect + Heavy Blur */}
        <div className="bg-surface-dark/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex justify-between items-center px-6 py-4 relative">
          
          <NavItem href="/" icon={<Home size={22} />} active={isActive('/')} label="Home" />
          <NavItem href="/shop" icon={<Search size={22} />} active={isActive('/shop')} label="Shop" />
          
         {/* CENTER ACTION: DYNAMIC CART */}
          <Link href="/cart" className="relative -top-8 group">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,180,216,0.6)] border-[6px] border-surface-dark text-primary transition-transform group-hover:scale-110">
              <ShoppingCart size={26} fill="currentColor" className="relative -left-0.5" />
              
              {/* DYNAMIC BADGE: Only show if count > 0 */}
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-surface-dark flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </div>
          </Link>

          <NavItem href="/account/dashboard" icon={<User size={22} />} active={isActive('/account/dashboard')} label="Account" />
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={clsx("flex flex-col items-center gap-1 transition-colors", isMenuOpen ? "text-accent" : "text-slate-400")}
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
            className="md:hidden fixed inset-0 z-40 bg-surface-dark/95 backdrop-blur-xl pt-24 px-6 pb-32 overflow-y-auto"
          >
             <div className="flex flex-col gap-6">
                <MenuLink href="/shop" label="The Collection" onClick={() => setIsMenuOpen(false)} />
                <MenuLink href="/products/aquaviv-mineral-drops" label="Mineral Drops" onClick={() => setIsMenuOpen(false)} />
                <MenuLink href="/affiliate/join" label="Partner Program" onClick={() => setIsMenuOpen(false)} />
                <div className="h-px bg-white/10 my-2" />
                <MenuLink href="/account/dashboard" label="Customer Dashboard" onClick={() => setIsMenuOpen(false)} />
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
    <Link href={href} className={clsx("flex flex-col items-center gap-1 transition-colors", active ? "text-accent" : "text-slate-400 hover:text-slate-200")}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}

function MenuLink({ href, label, onClick }: { href: string, label: string, onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="text-2xl font-bold text-white flex items-center justify-between group">
      {label}
      <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:bg-accent group-hover:text-primary group-hover:border-accent transition-all">→</span>
    </Link>
  )
}