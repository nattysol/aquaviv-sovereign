'use client';

import { useState } from 'react';
import { urlFor } from '@/sanity/lib/image';
import { Play, Pause, Image as ImageIcon } from 'lucide-react';
import clsx from 'clsx';
import { FadeIn } from '../ui/FadeIn';

interface ProductGalleryProps {
  mainImage: any;
  gallery?: any[];
  video?: string; // URL to the video file
}

export function ProductGallery({ mainImage, gallery = [], video }: ProductGalleryProps) {
  // 0 = Main Image, 1+ = Gallery Items, 'video' = Video
  const [activeIndex, setActiveIndex] = useState<number | 'video'>(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Combine main image + gallery into one list for thumbnails
  const allImages = [mainImage, ...gallery].filter(Boolean);

  return (
    <div className="flex flex-col gap-4">
      
      {/* 1. MAIN STAGE */}
      <FadeIn>
        <div className="relative w-full aspect-[4/5] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm group">
          
          {/* A. VIDEO PLAYER */}
          {activeIndex === 'video' && video ? (
            <div className="relative w-full h-full bg-black">
              <video 
                src={video} 
                className="w-full h-full object-cover"
                autoPlay={isPlaying}
                loop
                muted
                playsInline
                controls // Optional: Allow user controls
              />
            </div>
          ) : (
          /* B. IMAGE VIEWER */
            <img 
              src={urlFor(allImages[typeof activeIndex === 'number' ? activeIndex : 0]).width(1000).url()} 
              alt="Product View"
              className="w-full h-full object-contain p-8 transition-transform duration-700 group-hover:scale-105"
            />
          )}

          {/* Floating Badge (Only on first image) */}
          {activeIndex === 0 && (
            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
              Clinical Grade
            </div>
          )}
        </div>
      </FadeIn>

      {/* 2. THUMBNAIL STRIP */}
      {(allImages.length > 1 || video) && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          
          {/* Video Thumbnail */}
          {video && (
             <button
               onClick={() => setActiveIndex('video')}
               className={clsx(
                 "relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all flex items-center justify-center bg-slate-900 group",
                 activeIndex === 'video' ? "border-accent ring-2 ring-accent/20" : "border-transparent opacity-70 hover:opacity-100"
               )}
             >
                <Play className="w-8 h-8 text-white fill-current opacity-80 group-hover:scale-110 transition-transform" />
             </button>
          )}

          {/* Image Thumbnails */}
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={clsx(
                "relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all bg-white",
                activeIndex === i ? "border-accent ring-2 ring-accent/20" : "border-slate-100 opacity-70 hover:opacity-100"
              )}
            >
              <img 
                src={urlFor(img).width(200).url()} 
                className="w-full h-full object-cover" 
                alt="Thumbnail" 
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}