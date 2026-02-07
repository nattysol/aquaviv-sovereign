'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Logic: Is this the standalone "Links" page?
  const isStandalone = pathname?.startsWith('/links');

  // If yes, return ONLY the content (clean slate)
  if (isStandalone) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

  // If no, return the full website experience
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