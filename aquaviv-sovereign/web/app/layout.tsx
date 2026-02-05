import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar"; // Import Navbar
import { Footer } from "@/components/layout/Footer"; // Import Footer
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { CartProvider } from '@/components/providers/CartContext'; // <--- Import this
import { CartDrawer } from '@/components/cart/CartDrawer'; // <--- DO YOU HAVE THIS?
import { ReferralProvider } from '@/components/providers/ReferralContext'; // <--- Import this if you want referral context available globally  
import { Suspense } from 'react'; // <--- 1. Import this

export const metadata: Metadata = {
  title: "aquaViv Sovereign",
  description: "Clinical Grade Mineral Hydration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {/* 2. Wrap the Provider in Suspense */}
        <Suspense fallback={null}>
        <ReferralProvider><CartProvider> {/* <--- WRAP EVERYTHING INSIDE THIS */}
        {/* The Shell */}
        <Navbar />
        
        {/* The Page Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* The Footer */}
        <Footer />
        <MobileBottomNav /> {/* <--- ADD THIS LINE HERE */}
        <CartDrawer /> {/* <--- ADD THE CART DRAWER HERE */}
        </CartProvider>
        </ReferralProvider>
        </Suspense>
      </body>
    </html>
  );
}