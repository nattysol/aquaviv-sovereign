import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Script from 'next/script';

import { CartProvider } from '@/components/providers/CartContext';
import { CartDrawer } from '@/components/cart/CartDrawer'; // <--- 1. Import This
import { ReferralProvider } from '@/components/providers/ReferralContext';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { KLAVIYO_SCRIPT_URL } from '@/lib/klaviyo';
import { Navbar } from '@/components/layout/Navbar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'aquaViv | Sovereign Hydration',
  description: 'Clinical grade minerals for biological sovereignty.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <Suspense fallback={null}>
          <ReferralProvider>
            <CartProvider>
              <Navbar />
              {/* 2. PLACE THE DRAWER HERE (It is invisible until isOpen=true) */}
              <CartDrawer />
              {/* REMOVED: pt-20. Now the Homepage Hero will sit perfectly at the top. */}
              <main className="min-h-screen">
                {children}
              </main>
{/* 2. PLACE IT HERE (Outside Main) */}
              <MobileBottomNav />
              <Footer />
              <GoogleAnalytics />
              <Script 
                id="klaviyo-init"
                strategy="afterInteractive"
                src={KLAVIYO_SCRIPT_URL}
              />
            </CartProvider>
          </ReferralProvider>
        </Suspense>
      </body>
    </html>
  );
}