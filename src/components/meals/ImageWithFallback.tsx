'use client';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({ src, alt, className }: ImageWithFallbackProps) {
  return (
    <img
      alt={alt}
      className={className}
      src={src}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/placeholder-meal.svg';
      }}
    />
  );
}