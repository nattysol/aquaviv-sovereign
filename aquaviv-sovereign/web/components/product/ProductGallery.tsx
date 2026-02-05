'use client';

import { useState } from 'react';
import { urlFor } from '@/sanity/lib/image';
import { Play } from 'lucide-react';
import clsx from 'clsx';
import { FadeIn } from '../ui/FadeIn';

interface ProductGalleryProps {
  mainImage: any;
  gallery?: any[]; // The "?" means it might be undefined/null
  video?: string;
}

export function ProductGallery({ mainImage, gallery, video }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | 'video'>(0);

  // --- THE FIX: SAFETY FIRST ---
  // If 'gallery' is null (from Sanity), use [] (empty array) instead.
  // This prevents the "not iterable" crash.
  const safeGallery = gallery || [];
  
  // Combine main image + safety gallery into one list
  const allImages = [mainImage, ...safeGallery].filter(Boolean);

  // If we have a video, the "Video" view is available
  const hasVideo = !!video;
  // If we have more than 1 image, or 1 image + video, show thumbnails
  const showThumbnails = allImages.length > 1 || hasVideo;

  return (
    <div className="flex flex-col gap-4">
      
      {/* 1. MAIN STAGE */}
      <FadeIn>
        <div className="relative w-full aspect-[4/5] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group select-none">
          
          {/* A. VIDEO PLAYER */}
          {activeIndex === 'video' && video ? (
            <div className="relative w-full h-full bg-black">
              <video 
                src={video} 
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                controlsList="nodownload"
                // Optional: Add 'controls' if you want the user to scrub/pause
                controls
              />
            </div>
          ) : (
          /* B. IMAGE VIEWER */
            <div className="w-full h-full flex items-center justify-center p-8">
               <img 
                 src={urlFor(allImages[typeof activeIndex === 'number' ? activeIndex : 0]).width(1200).url()} 
                 alt="Product View"
                 className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
               />
            </div>
          )}

          {/* Floating Badge (Only on first image/main view) */}
          {activeIndex === 0 && (
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm z-10">
              Clinical Grade
            </div>
          )}
        </div>
      </FadeIn>

      {/* 2. THUMBNAIL STRIP */}
      {showThumbnails && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          
          {/* A. Video Thumbnail */}
          {hasVideo && (
             <button
               onClick={() => setActiveIndex('video')}
               className={clsx(
                 "relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all flex items-center justify-center bg-slate-900 group snap-start focus:outline-none",
                 activeIndex === 'video' ? "border-accent ring-2 ring-accent/20" : "border-transparent opacity-70 hover:opacity-100"
               )}
             >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                   <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                </div>
             </button>
          )}

          {/* B. Image Thumbnails */}
          {allImages.map((img, i) => {
            const isActive = activeIndex === i;
            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={clsx(
                  "relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all bg-white snap-start focus:outline-none",
                  isActive ? "border-accent ring-2 ring-accent/20" : "border-slate-100 opacity-70 hover:opacity-100"
                )}
              >
                <img 
                  src={urlFor(img).width(200).height(200).url()} 
                  className="w-full h-full object-contain p-2" 
                  alt={`Thumbnail ${i + 1}`} 
                />
              </button>
            )
          })}
        </div>
      )}

    </div>
  );
}