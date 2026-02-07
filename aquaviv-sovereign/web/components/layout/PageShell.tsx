'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 1. Detect if we are on the hidden "Links" page
  const isStandalone = pathname?.startsWith('/links');

  // 2. If YES, return ONLY the content (No Nav, No Footer)
  if (isStandalone) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  // 3. If NO (Normal Website), return the Full Experience
  return (
    <>
      <Navbar />
      <CartDrawer />
      
      <main className="min-h-screen">
        {children}
      </main>

      <MobileBottomNav />
      <Footer />
    </>
  );
}