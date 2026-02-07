'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { CartDrawer } from '@/components/cart/CartDrawer';

export function PageShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // LOGIC: Hide Nav on 'Links' page AND 'Quiz' page
  const isStandalone = pathname?.startsWith('/links') || pathname?.startsWith('/quiz');

  if (isStandalone) {
    return (
      <main className="min-h-screen">
        {children}
      </main>
    );
  }

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