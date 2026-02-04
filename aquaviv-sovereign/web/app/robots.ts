import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Replace with your actual production domain when ready
  const baseUrl = 'https://aquaviv-sovereign.vercel.app';

  return {
    rules: [
      // 1. STANDARD BOTS (Google, Bing)
      // We allow them to index products, but keep them out of private areas.
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',      // Privacy: User dashboards
          '/api/',          // Security: Backend endpoints
          '/studio/',       // Security: CMS
          '/private/',      // Security: Internal pages
        ],
      },

      // 2. AI AGENTS (The VIP List)
      // We explicitly welcome these bots to traverse the full shopping flow.
      {
        userAgent: [
          'GPTBot',          // OpenAI (Training & General)
          'ChatGPT-User',    // OpenAI (Active User Browsing)
          'OAI-SearchBot',   // SearchGPT
          'Google-Extended', // Google Gemini / Bard
          'Claude-Web',      // Anthropic
          'PerplexityBot',   // Perplexity AI
        ],
        allow: [
          '/', 
          '/shop', 
          '/products', 
          '/cart',      // <--- CRITICAL: Allows AI to "see" the cart
          '/checkout'   // <--- CRITICAL: Allows AI to attempt checkout navigation
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}