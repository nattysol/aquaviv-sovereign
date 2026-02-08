import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Script from 'next/script';
import { ChatWidget } from '@/components/layout/ChatWidget';
import { ChatProvider } from '@/components/providers/ChatContext';
import { ChatModal } from '@/components/layout/ChatModal';

// Providers
import { CartProvider } from '@/components/providers/CartContext';
import { ReferralProvider } from '@/components/providers/ReferralContext';

// Components
import { PageShell } from '@/components/layout/PageShell'; // <--- The only layout component we keep
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { KLAVIYO_SCRIPT_URL } from '@/lib/klaviyo';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'aquaViv | Sovereign Hydration',
  description: 'Clinical grade minerals for biological sovereignty.',
  icons: {
    icon: '/icon.webp', // <--- Add this line
  },
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
            {/* 2. Wrap CartProvider inside ChatProvider (or vice versa, order doesn't matter much) */}
            <ChatProvider>
            <CartProvider>
              
              {/* --- THE FIX: ONLY USE PAGESHELL --- */}
              {/* It automatically decides whether to show the Navbar/Footer or not. */}
              <PageShell>
                {children}
              </PageShell>
              {/* 2. PLACE CHAT WIDGET HERE (Above footer, below navs) */}
              <ChatModal />
              {/* Analytics stay global */}
              <GoogleAnalytics />
              <Script 
                id="klaviyo-init"
                strategy="afterInteractive"
                src={KLAVIYO_SCRIPT_URL}
              />
              
            </CartProvider>
            </ChatProvider>
          </ReferralProvider>
        </Suspense>
      </body>
    </html>
  );
}