'use client';

import Link from 'next/link';
import Image from 'next/image'; // <--- Import Image component
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO - Updated */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-12 w-48"> {/* Controls logo size */}
              <Image 
                src="/logo.svg"
                alt="aquaViv Sovereign"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/product" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              The Mineral Drops
            </Link>
            <Link href="/affiliate/join" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Partner Program
            </Link>
            <Link href="/journal" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Journal
            </Link>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-900 hover:text-primary font-medium text-sm">
              Sign In
            </button>
            <Link href="/product" className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#002a55] transition-all hover:shadow-lg hover:shadow-primary/20">
              <span>Shop Ritual</span>
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-600 hover:text-primary"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white absolute w-full shadow-xl">
          <div className="px-4 py-6 space-y-4 flex flex-col">
            <Link href="/product" className="text-lg font-medium text-slate-900" onClick={() => setIsOpen(false)}>
              The Mineral Drops
            </Link>
            <Link href="/affiliate/join" className="text-lg font-medium text-slate-900" onClick={() => setIsOpen(false)}>
              Partner Program
            </Link>
            <Link href="/journal" className="text-lg font-medium text-slate-900" onClick={() => setIsOpen(false)}>
              Journal
            </Link>
            <div className="h-px bg-slate-100 my-2" />
            <Link href="/product" className="w-full bg-primary text-white py-3 rounded-lg text-center font-bold" onClick={() => setIsOpen(false)}>
              Shop Ritual
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}