
'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Crown, ShieldCheck, Truck, Users, 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import api, { optimizeImage } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

const MotionDiv = motion.div as any;

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "0.3 0.3"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?limit=12')
        ]);
        
        if (isMounted) {
          setCategories(catRes.data || []);
          setProducts(prodRes.data.data || []);
        }
      } catch (err) {
        console.error("Home Data Sync Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const bestSellers = useMemo(() => products.filter(p => p.isBestSeller).slice(0, 4), [products]);
  const newArrivals = useMemo(() => products.slice(0, 8), [products]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth * 0.4;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div ref={containerRef} className="relative bg-[#FAFAFA] selection:bg-emerald-600 selection:text-white overflow-x-hidden">
      
      {/* 1. ELITE HERO SECTION */}
      <section className="relative h-[90vh] flex items-center justify-center bg-[#05110E] overflow-hidden">
        <MotionDiv style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image 
            src="/images/reg.png" 
            alt="Furato Background" 
            fill 
            priority
            quality={60}
            sizes="100vw"
            className="object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#05110E]/40 to-[#FAFAFA]" />
        </MotionDiv>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase mb-8">
              <Crown size={12} /> Elite Shopping Experience
            </div>
            
            <h1 className="text-[12vw] md:text-[8rem] font-black text-white leading-none tracking-tighter mb-12 select-none uppercase">
              FURATO <br />
              <span className="text-emerald-500 italic font-light">EMERALD</span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/products" className="group px-12 py-5 bg-white text-emerald-950 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest">
                اكتشف المجموعات
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* 2. STATS RIBBON */}
      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white/95 backdrop-blur-xl shadow-2xl rounded-[3rem] border border-emerald-50 overflow-hidden divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-emerald-50">
          <StatItem icon={<Truck />} title="شحن فائق" desc="توصيل خلال 24 ساعة" />
          <StatItem icon={<ShieldCheck />} title="ضمان الأصالة" desc="منتجات أصلية موثقة" />
          <StatItem icon={<Users />} title="مجتمع النخبة" desc="+5000 عميل يثقون بنا" />
        </div>
      </div>

      {/* 3. CATEGORY CAROUSEL */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-6 mb-12 flex justify-between items-end">
          <div className="space-y-2">
             <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em]">Curated Sections</span>
             <h2 className="text-4xl md:text-5xl font-black text-emerald-950 tracking-tighter">المجموعات المختارة</h2>
          </div>
          <div className="flex gap-3">
             <button onClick={() => scrollCarousel('right')} className="w-12 h-12 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-900 shadow hover:bg-emerald-50 transition-all"><ChevronRight size={20}/></button>
             <button onClick={() => scrollCarousel('left')} className="w-12 h-12 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-900 shadow hover:bg-emerald-50 transition-all"><ChevronLeft size={20}/></button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="flex gap-6 px-12 overflow-x-auto no-scrollbar pb-10 snap-x"
        >
          {loading ? (
            [1,2,3,4,5].map(i => (
              <div key={i} className="shrink-0 w-[70vw] md:w-[22vw] aspect-[4/5] bg-slate-100 rounded-[2.5rem] animate-pulse" />
            ))
          ) : categories.map((cat) => (
            <div 
              key={cat._id}
              className="shrink-0 w-[70vw] md:w-[22vw] aspect-[4/5] relative rounded-[2.5rem] overflow-hidden snap-center group shadow-lg"
            >
              <Link href={`/products?category=${cat._id}`} className="block w-full h-full">
                <Image 
                  src={optimizeImage(cat.imageUrl, 500)} 
                  alt={cat.name} 
                  fill 
                  sizes="(max-width: 768px) 70vw, 22vw"
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-emerald-950/20 to-transparent" />
                <div className="absolute bottom-8 inset-x-8 text-center">
                   <h3 className="text-white text-xl font-bold tracking-tight">{cat.name}</h3>
                   <div className="mt-2 w-8 h-1 bg-emerald-500 mx-auto rounded-full" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS */}
      {!loading && bestSellers.length > 0 && (
        <section className="py-24 bg-emerald-950 rounded-[4rem] mx-4 md:mx-8 shadow-3xl overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full" />
           <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-16 space-y-4">
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Global Favorites</span>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">الأكثر مبيعاً</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {bestSellers.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
           </div>
        </section>
      )}

      {/* 5. NEW ARRIVALS */}
      <section className="py-32 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
             <span className="text-emerald-600 font-black text-[10px] uppercase tracking-widest">Fresh Arrivals</span>
             <h2 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tighter">وصل حديثاً</h2>
          </div>
          <Link href="/products" className="text-emerald-600 font-black text-xs uppercase tracking-widest border-b-2 border-emerald-100 pb-1 hover:border-emerald-500 transition-all">
             عرض الكل
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
             [1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] animate-pulse" />)
          ) : newArrivals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 text-center space-y-3 hover:bg-emerald-50/30 transition-colors">
       <div className="text-emerald-600 flex justify-center">
         {React.cloneElement(icon as React.ReactElement, { size: 32 })}
       </div>
       <div>
         <h4 className="font-bold text-emerald-950 text-lg leading-tight">{title}</h4>
         <p className="text-emerald-900/40 text-[10px] font-medium uppercase mt-2 tracking-widest">{desc}</p>
       </div>
    </div>
  );
}
