'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/lib/types';
import "swiper/css";

export default function CategorySlider({ categories }: { categories: Category[] }) {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={2}
      breakpoints={{
        640: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        1024: { slidesPerView: 6 },
      }}
      autoplay={{ delay: 2000 }}
      loop
      modules={[Autoplay]}
    >
      {categories.map(cat => (
        <SwiperSlide key={cat._id}>
          <div className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition text-center border">
            <Link href={`/categories/${cat.name ?? cat.name}`} className="relative w-full h-32 flex items-center justify-center mb-4 block">
              <Image src={cat.imageUrl} alt={cat.name} width={140} height={120} className="object-contain rounded-md" />
            </Link>
            <h3 className="pt-1 text-lg font-semibold">
              <Link href={`/categories/${cat.name ?? cat.name}`} className="hover:text-green-600">{cat.name}</Link>
            </h3>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
