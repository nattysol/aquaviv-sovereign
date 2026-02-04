'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // UPDATED: bg-surface-dark/90 creates a dark, premium glass effect
    <nav className="sticky top-0 z-50 bg-surface-dark/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO - Now sits on a dark background */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-10 w-40">
              {/* Note: If your logo is dark blue, we invert it to white here for visibility */}
              <Image 
                src="/logo.svg"
                alt="aquaViv Sovereign"
                fill
                className="object-contain object-left brightness-0 invert" 
                priority
              />
            </div>
          </Link>

          {/* Desktop Links - Updated text colors to White/Light Grey */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/products/aquaviv-mineral-drops" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              The Mineral Drops
            </Link>
            <Link href="/affiliate/join" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Partner Program
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Journal
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/account/login" className="text-slate-300 hover:text-white font-medium text-sm flex items-center gap-2">
              <User className="w-4 h-4" />
              Sign In
            </Link>
            <Link href="/shop" className="flex items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-full text-sm font-bold hover:bg-accent hover:text-white transition-all">
              <span>Shop Our Store</span>
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hidden text-slate-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dark Theme) */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface-dark absolute w-full shadow-xl">
          <div className="px-4 py-6 space-y-4 flex flex-col">
            <Link href="/products/aquaviv-mineral-drops" className="text-lg font-medium text-slate-200" onClick={() => setIsOpen(false)}>
              The Mineral Drops
            </Link>
            <Link href="/affiliate/join" className="text-lg font-medium text-slate-200" onClick={() => setIsOpen(false)}>
              Partner Program
            </Link>
            <Link href="/account/login" className="text-lg font-medium text-slate-200" onClick={() => setIsOpen(false)}>
              Member Login
            </Link>
            <div className="h-px bg-white/10 my-2" />
            <Link href="/shop" className="w-full bg-accent text-white py-3 rounded-lg text-center font-bold" onClick={() => setIsOpen(false)}>
              Shop Our Store
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}