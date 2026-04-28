"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Play, ArrowsOut } from "phosphor-react";

interface MediaGridProps {
  urls: string[];
  compact?: boolean;
}

export function MediaGrid({ urls, compact = false }: MediaGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!urls || urls.length === 0) return null;

  const count = urls.length;
  
  const getGridClass = () => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2 grid-rows-2";
    if (count === 4) return "grid-cols-2 grid-rows-2";
    return "grid-cols-2";
  };

  const getItemClass = (index: number) => {
    if (count === 3 && index === 0) return "row-span-2 h-full";
    return "h-full";
  };

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg)$/i) || url.includes("video");
  };

  return (
    <div 
      className={cn(
        "mt-3 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-neutral-100 dark:bg-neutral-900 grid gap-1",
        getGridClass(),
        compact ? "max-h-[240px]" : "max-h-[540px]"
      )}
    >
      {urls.slice(0, 4).map((url, i) => (
        <div 
          key={i} 
          className={cn(
            "relative group overflow-hidden cursor-zoom-in",
            getItemClass(i)
          )}
          onMouseEnter={() => setHoveredIndex(i)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {isVideo(url) ? (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <video 
                src={url} 
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Play size={20} weight="fill" className="text-white" />
                </div>
              </div>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={`Media ${i + 1}`}
              className={cn(
                "w-full h-full object-cover transition-transform duration-700 ease-out",
                hoveredIndex === i ? "scale-105" : "scale-100"
              )}
              loading="lazy"
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white">
              <ArrowsOut size={12} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
