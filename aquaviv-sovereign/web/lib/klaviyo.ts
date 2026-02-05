// web/lib/klaviyo.ts

declare global {
  interface Window {
    _learnq: any[];
  }
}

// 1. Initialize (The Script)
export const KLAVIYO_SCRIPT_URL = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.NEXT_PUBLIC_KLAVIYO_PUBLIC_KEY}`;

// 2. Track Events (e.g., "Viewed Product")
export const trackKlaviyoEvent = (eventName: string, properties: any) => {
  if (typeof window !== 'undefined' && window._learnq) {
    window._learnq.push(['track', eventName, properties]);
  }
};

// 3. Identify User (e.g., on Login or Newsletter Signup)
export const identifyKlaviyoProfile = (email: string) => {
  if (typeof window !== 'undefined' && window._learnq) {
    window._learnq.push(['identify', { $email: email }]);
  }
};