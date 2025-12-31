'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { Product } from '@/lib/types';
import { Clock, TrendingUp } from 'lucide-react';
import "swiper/css";

export default function ProductSwiper({ products, title, icon }: { products: Product[], title: string, icon: 'Clock' | 'TrendingUp' }) {
  const Icon = icon === 'Clock' ? Clock : TrendingUp;

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center text-gray-800">
          <Icon className="mr-2" /> {title}
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          loop
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 6 },
          }}
        >
          {products.slice(0, 10).map(product => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
