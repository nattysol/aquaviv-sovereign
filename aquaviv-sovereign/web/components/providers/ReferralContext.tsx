'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type ReferralContextType = {
  referralCode: string | null;
};

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export function ReferralProvider({ children }: { children: React.ReactNode }) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem('aquaviv_ref', ref);
    } else {
      const stored = localStorage.getItem('aquaviv_ref');
      if (stored) setReferralCode(stored);
    }
  }, [searchParams]);

  return (
    <ReferralContext.Provider value={{ referralCode }}>
      {children}
    </ReferralContext.Provider>
  );
}

// --- THE FIX IS HERE ---
export function useReferral() {
  const context = useContext(ReferralContext);
  // If we try to use this hook outside the Provider, return null (safe fallback)
  // or throw an error. Returning the context directly fixes the TS issue 
  // if we handle the 'undefined' case in the consuming component, 
  // BUT the easiest fix is to force it:
  if (context === undefined) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
}