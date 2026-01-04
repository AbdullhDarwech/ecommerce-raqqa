
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Clock, Percent, ArrowLeft, 
  ShoppingBag, ShieldCheck, Crown, Loader2,
  Gift, Zap, TrendingDown
} from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

const MotionDiv = motion.div as any;

export default function OffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  // محاكاة مؤقت العد التنازلي
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await api.get('/products?limit=50');
        // فلترة المنتجات التي لديها سعر قديم أو نسبة خصم
        const discounted = (res.data.data || []).filter((p: Product) => 
          p.priceOld || p.discountPercentage || p.isBestSeller
        );
        setProducts(discounted);
      } catch (err) {
        console.error("Offers fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-24">
      
      {/* 1. ELITE OFFERS HERO */}
      <section className="relative pt-40 pb-32 bg-emerald-950 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/10 blur-[120px] rounded-full animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[10px] font-black tracking-[0.4em] uppercase mb-8 shadow-2xl"
          >
            <Crown size={14} className="animate-bounce" /> Exclusive Royal Invitations
          </MotionDiv>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-8">
            عروض <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-200 to-emerald-500">السيادة</span> الاستثمارية
          </h1>
          
          <p className="text-emerald-50/60 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed mb-12">
            تم انتقاء هذه القائمة بعناية فائقة لشركائنا من الصفوة، حيث تجتمع الفخامة مع القيمة الاستثمارية الاستثنائية.
          </p>

          {/* Countdown Display */}
          <div className="flex justify-center gap-4 md:gap-8">
            <TimerUnit value={timeLeft.hours} label="ساعة" />
            <div className="text-amber-400 text-4xl font-black self-center">:</div>
            <TimerUnit value={timeLeft.minutes} label="دقيقة" />
            <div className="text-amber-400 text-4xl font-black self-center">:</div>
            <TimerUnit value={timeLeft.seconds} label="ثانية" />
          </div>
        </div>
        
        {/* Decorative Wave */}
        <div className="absolute -bottom-1 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* 2. OFFERS CONTENT */}
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_40px_100px_-20px_rgba(6,78,59,0.1)] border border-emerald-50">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <Percent size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-emerald-950 tracking-tight">قائمة المزايا الحالية</h2>
                <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest">تحديث لحظي لفرص الاقتناء</p>
              </div>
            </div>

            <div className="flex gap-4">
               <div className="flex items-center gap-2 px-6 py-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <ShieldCheck size={18} className="text-emerald-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950">ضمان الموثوقية</span>
               </div>
               <div className="flex items-center gap-2 px-6 py-3 bg-stone-50 rounded-2xl border border-stone-100">
                  <Zap size={18} className="text-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-950">توصيل نخبوي</span>
               </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="aspect-[3/4] bg-stone-50 rounded-[2rem] animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <MotionDiv 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
            >
              <AnimatePresence>
                {products.map((product, idx) => (
                  <MotionDiv
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="relative group">
                      {/* Special Discount Badge */}
                      <div className="absolute -top-4 -right-4 z-30 bg-amber-500 text-emerald-950 w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 border-white rotate-12 group-hover:rotate-0 transition-transform duration-500">
                         <span className="text-[10px] font-black leading-none">خصم</span>
                         <span className="text-lg font-black leading-none">%{product.discountPercentage || 15}</span>
                      </div>
                      <ProductCard product={product} />
                    </div>
                  </MotionDiv>
                ))}
              </AnimatePresence>
            </MotionDiv>
          ) : (
            <div className="text-center py-32 bg-stone-50/50 rounded-[4rem] border-2 border-dashed border-stone-200">
              <Gift size={48} className="mx-auto mb-6 text-stone-200" />
              <h3 className="text-2xl font-black text-emerald-950 mb-2 tracking-tight">ترقبوا المزيد من العروض</h3>
              <p className="text-stone-400 text-sm font-medium mb-10 max-w-xs mx-auto">نقوم حالياً بتجهيز قائمة جديدة من العروض الحصرية التي تليق بتطلعاتكم.</p>
              <Link href="/products" className="px-10 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">
                تصفح المعرض الشامل
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 3. PROMOTION STRIP */}
      <section className="py-24 container mx-auto px-6">
         <div className="bg-emerald-600 rounded-[4rem] p-12 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl shadow-emerald-500/20">
            <div className="relative z-10 text-center md:text-right space-y-6">
               <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">اشترك في النشرة النخبوية</h2>
               <p className="text-emerald-50/80 max-w-md mx-auto md:mx-0 font-medium">كن أول من يتلقى دعوات "فوراتو" الخاصة للمزادات والعروض السرية قبل طرحها للعامة.</p>
               <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <input 
                    type="email" 
                    placeholder="بريدك الإلكتروني" 
                    className="flex-1 px-8 py-5 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-all font-bold"
                  />
                  <button className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl">
                    انضم الآن
                  </button>
               </div>
            </div>
            
            <div className="relative z-10 w-full md:w-1/3 aspect-square bg-emerald-500 rounded-[3rem] shadow-2xl border border-emerald-400/30 flex items-center justify-center group overflow-hidden">
               <TrendingDown size={120} className="text-white/20 absolute -bottom-10 -left-10 group-hover:scale-110 transition-transform duration-1000" />
               <Sparkles size={80} className="text-amber-300 animate-pulse" />
            </div>

            {/* Background Shape */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
         </div>
      </section>
    </div>
  );
}

function TimerUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 md:w-20 h-20 md:h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
        <span className="text-3xl md:text-4xl font-black text-white tabular-nums">
          {value < 10 ? `0${value}` : value}
        </span>
      </div>
      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}
