'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ClientBanner({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="relative h-72 w-full overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Banner ${index}`}
          fill
          priority
          className="object-cover transition-opacity duration-500"
          style={{ opacity: index === currentIndex ? 1 : 0 }}
        />
      ))}
    </section>
  );
}
