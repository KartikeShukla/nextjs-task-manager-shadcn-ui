'use client';

import { useState } from 'react';

interface FallbackImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export function FallbackImage({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "https://via.placeholder.com/500x400?text=Arbitration+Institute" 
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={() => setImgSrc(fallbackSrc)} 
    />
  );
} 