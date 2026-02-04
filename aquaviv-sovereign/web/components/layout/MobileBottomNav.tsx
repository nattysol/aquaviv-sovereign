'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper to check active state
  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* 1. THE BOTTOM DECK (Visible only on Mobile) */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="bg-surface-dark/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex justify-between items-center px-6 py-4">
          
          <NavItem href="/" icon={<Home size={20} />} active={isActive('/')} label="Home" />
          <NavItem href="/shop" icon={<Search size={20} />} active={isActive('/shop')} label="Shop" />
          
          {/* Center Action Button (Cart) */}
          <Link href="/cart" className="relative -top-8">
            <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,180,216,0.4)] border-4 border-surface-dark text-primary">
              <ShoppingBag size={24} fill="currentColor" />
            </div>
          </Link>

          <NavItem href="/account/dashboard" icon={<User size={20} />} active={isActive('/account/dashboard')} label="Account" />
          
          {/* Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={clsx("flex flex-col items-center gap-1 transition-colors", isMenuOpen ? "text-accent" : "text-slate-400")}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span className="text-[10px] font-medium">Menu</span>
          </button>

        </div>
      </div>

      {/* 2. THE FULL SCREEN MENU (When 'Menu' is clicked) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="md:hidden fixed inset-0 z-40 bg-surface-dark/95 backdrop-blur-md pt-24 px-6 pb-32 overflow-y-auto"
          >
             <div className="flex flex-col gap-6">
                <MenuLink href="/shop" label="The Collection" onClick={() => setIsMenuOpen(false)} />
                <MenuLink href="/products/aquaviv-mineral-drops" label="Mineral Drops" onClick={() => setIsMenuOpen(false)} />
                <MenuLink href="/affiliate/join" label="Partner Program" onClick={() => setIsMenuOpen(false)} />
                <div className="h-px bg-white/10 my-2" />
                <MenuLink href="/account/dashboard" label="Sovereign Dashboard" onClick={() => setIsMenuOpen(false)} />
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
    <Link href={href} className={clsx("flex flex-col items-center gap-1 transition-colors", active ? "text-accent" : "text-slate-400")}>
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