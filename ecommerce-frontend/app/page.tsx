
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Crown, ShieldCheck, Truck, Users, 
  ChevronLeft, ChevronRight, Sparkles,
  TrendingUp, Package, Clock, Star, ArrowRight,
  MessageCircle, HeartHandshake, ShieldAlert
} from 'lucide-react';
import api, { optimizeImage } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

const MotionDiv = motion.div as any;

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
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
        const [catRes, bestRes, newRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products?isBestSeller=true&limit=4'),
          api.get('/products?limit=8')
        ]);
        
        if (isMounted) {
          setCategories(catRes.data || []);
          setBestSellers(bestRes.data.data || []);
          setNewArrivals(newRes.data.data || []);
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

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = window.innerWidth * 0.5;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div ref={containerRef} className="relative bg-white selection:bg-emerald-600 selection:text-white overflow-x-hidden min-h-screen">
      
      {/* 1. ELITE HERO SECTION */}
      <section className="relative h-[85vh] flex items-center justify-center bg-emerald-950 overflow-hidden">
        <MotionDiv style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=2000" 
            alt="Furato Excellence" 
            fill 
            priority
            className="object-cover opacity-20 mix-blend-overlay" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/40 via-emerald-950/80 to-white" />
          
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/20 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-400/10 blur-[100px] rounded-full animate-pulse delay-700" />
        </MotionDiv>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full text-amber-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-8 shadow-xl">
              <Crown size={12} className="animate-bounce" /> The Sovereign shopping experience
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tight mb-8 select-none">
              FURATO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-200 to-emerald-500 italic font-medium">EXCELLENCE</span>
            </h1>

            <p className="text-emerald-50/70 text-sm md:text-lg mb-10 max-w-xl mx-auto font-medium leading-relaxed">
              اكتشف عالم المقتنيات النادرة التي صُممت لتعكس ذوقك النخبوي. تجربة تسوق زمردية استثنائية في قلب الرقة.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/products" className="group px-12 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-xs transition-all hover:bg-emerald-500 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.4)] uppercase tracking-[0.2em] flex items-center gap-2">
                ابدأ رحلة الاقتناء <ArrowRight size={16} />
              </Link>
              <Link href="/stores" className="px-12 py-5 border border-white/20 text-white hover:bg-white/10 rounded-[2rem] font-black text-xs transition-all uppercase tracking-[0.2em] backdrop-blur-xl">
                شركاؤنا المعتمدون
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* 2. STATS RIBBON */}
      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white/95 backdrop-blur-3xl shadow-[0_20px_50px_-10px_rgba(6,78,59,0.1)] rounded-[3rem] border border-emerald-50 overflow-hidden divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-emerald-50">
          <StatItem icon={<Truck className="text-emerald-600" />} title="شحن لوجستي" desc="توصيل سيادي خلال 24 ساعة" />
          <StatItem icon={<ShieldCheck className="text-amber-500" />} title="ميثاق الأصالة" desc="منتجات موثقة بشهادة جودة" />
          <StatItem icon={<Users className="text-teal-600" />} title="نادي الصفوة" desc="+5000 عميل يثقون بنا" />
        </div>
      </div>

      {/* 3. BEST SELLERS SECTION */}
      <section className=" py-10 md:py-24 bg-white">
         <div className="container rtl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 px-4 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
                  <Star size={12} fill="currentColor" /> Elite Selection
                </span>
                <h2 className="text-4xl md:text-6xl  font-black text-emerald-950 tracking-tighter">الأكثر <span className="text-emerald-600 italic">مبيعاً</span></h2>
              </div>
              <Link href="/products?sort=best_selling" className="text-xs font-black text-emerald-900/40 hover:text-emerald-600 uppercase tracking-widest border-b-2 border-transparent hover:border-emerald-600 pb-1 transition-all">تصفح القائمة الكاملة</Link>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-stone-50 rounded-[2rem] animate-pulse" />)
              ) : bestSellers.length > 0 ? (
                bestSellers.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                   <p className="text-stone-400 font-bold">لا توجد منتجات أكثر مبيعاً حالياً</p>
                </div>
              )}
            </div>
         </div>
      </section>

      {/* 4. CURATED CATEGORIES */}
      <section className="py-10 md:py-24 bg-stone-50/50">
        <div className="container mx-auto px-6 mb-16 flex justify-between items-center">
          <div className="space-y-2">
             <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em]">Curated Worlds</span>
             <h2 className="text-4xl font-black text-emerald-950 tracking-tighter">المجموعات السيادية</h2>
          </div>
          <div className="flex gap-4">
             <button onClick={() => scrollCarousel('right')} className="w-12 h-12 rounded-2xl border border-emerald-100 bg-white flex items-center justify-center text-emerald-900 shadow-sm hover:bg-emerald-50 transition-all"><ChevronRight size={20}/></button>
             <button onClick={() => scrollCarousel('left')} className="w-12 h-12 rounded-2xl border border-emerald-100 bg-white flex items-center justify-center text-emerald-900 shadow-sm hover:bg-emerald-50 transition-all"><ChevronLeft size={20}/></button>
          </div>
        </div>

        <div ref={carouselRef} className="flex gap-6 px-6 md:px-12 overflow-x-auto no-scrollbar pb-10 snap-x scroll-smooth">
          {loading ? (
            [1,2,3,4,5].map(i => <div key={i} className="shrink-0 w-[70vw] md:w-[25vw] aspect-[4/5] bg-stone-100 rounded-[3rem] animate-pulse" />)
          ) : categories.map((cat) => (
            <MotionDiv key={cat._id} whileHover={{ scale: 0.98 }} className="shrink-0 w-[50vw] md:w-[25vw] aspect-[3.7/5] relative rounded-[3rem] overflow-hidden snap-center group shadow-2xl border border-emerald-50">
              <Link href={`/products?category=${cat._id}`} className="block w-full h-full">
                <Image 
                  src={optimizeImage(cat.imageUrl, 600)} 
                  alt={cat.name} 
                  fill 
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent" />
                <div className="absolute bottom-0 md:bottom-10 inset-x-8">
                   <h3 className="text-white text-2xl font-black tracking-tight mb-3">{cat.name}</h3>
                   <span className="text-amber-400 text-[9px] font-black uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">اكتشف المقتنيات</span>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-10 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-1 bg-emerald-600 rounded-full" />
                 <span className="text-emerald-950 font-black text-[10px] uppercase tracking-[0.5em]">Minted Lately</span>
               </div>
               <h2 className="text-4xl md:text-6xl font-black text-emerald-950 tracking-tighter">وصل <span className="text-emerald-600 italic">حديثاً</span></h2>
            </div>
            <Link href="/products" className="group flex items-center gap-3 text-emerald-600 font-black text-xs uppercase tracking-widest pb-2 border-b-2 border-emerald-50 hover:border-emerald-600 transition-all">
               المعرض الشامل <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-10 md:gap-y-20">
            {loading ? (
               [1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] bg-stone-50 rounded-[2.5rem] animate-pulse" />)
            ) : newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. PARTNER CTA */}
      <section className="py-32 container mx-auto px-6">
         <div className="bg-emerald-950 rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-3xl border border-white/5">
            <div className="relative z-10 text-center md:text-right max-w-2xl">
               <span className="text-amber-400 font-black text-[10px] uppercase tracking-[0.5em] block mb-6">Partner Program</span>
               <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">سجل مقتنياتك <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">كشريك نُخبوي</span></h2>
               <p className="text-emerald-50/60 font-medium text-lg md:text-xl leading-relaxed mb-12">نفتح أبواب فوراتو لأصحاب العلامات التجارية والمقتنيات الفاخرة في الرقة لعرض منتجاتهم لجمهورنا المتميز.</p>
               
               <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                 <a 
                   href="https://wa.me/963930904315"
                   className="px-12 py-6 bg-amber-500 text-emerald-950 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-amber-400 transition-all shadow-2xl flex items-center justify-center gap-4"
                 >
                   تواصل سيادي مباشر <MessageCircle size={20} fill="currentColor" />
                 </a>
               </div>
            </div>
            
            <div className="absolute -bottom-20 -left-20 opacity-10 rotate-12 hidden lg:block">
               <Crown size={600} className="text-white" />
            </div>

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
         </div>
      </section>

      {/* 7. FLOATING CONTACT */}
      <div className="fixed bottom-10 left-6 z-[100] lg:bottom-12 lg:left-12 floating-whatsapp">
        <a
          href="https://wa.me/963930904315"
          target="_blank"
          rel="noopener noreferrer"
          className="relative block group"
        >
          <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="relative bg-[#25D366] text-white p-4 rounded-full shadow-3xl hover:scale-110 active:scale-95 transition-all duration-500 border-2 border-white/20">
            <MessageCircle size={30} fill="white" />
          </div>
        </a>
      </div>
    </div>
  );
}

function StatItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 text-center space-y-4 hover:bg-emerald-50/40 transition-all duration-700 group">
       <div className="flex justify-center group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500">
         {React.cloneElement(icon as React.ReactElement<any>, { size: 42, strokeWidth: 1.2 })}
       </div>
       <div className="space-y-1">
         <h4 className="font-black text-emerald-950 text-xl tracking-tight">{title}</h4>
         <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">{desc}</p>
       </div>
    </div>
  );
}
