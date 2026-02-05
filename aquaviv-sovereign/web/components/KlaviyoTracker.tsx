'use client';

import { useEffect } from 'react';
import { trackKlaviyoEvent } from '@/lib/klaviyo';

export function KlaviyoTracker({ product }: { product: any }) {
  useEffect(() => {
    // Wait 2 seconds to confirm "Viewed" interest
    const timer = setTimeout(() => {
      trackKlaviyoEvent('Viewed Product', {
        Title: product.title,
        ItemId: product.store?.gid || product.slug?.current,
        Price: product.price,
        Url: window.location.href,
        ImageUrl: product.mainImage?.asset?.url || '',
      });
      
      trackKlaviyoEvent('Viewed Item', {
        Title: product.title,
      });
    }, 2000); 

    return () => clearTimeout(timer);
  }, [product]);

  return null;
}