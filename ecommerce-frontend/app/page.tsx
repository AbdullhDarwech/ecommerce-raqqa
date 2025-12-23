
'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowUpRight, Crown, Gem, 
  Sparkles, MoveDown, ShoppingBag, 
  ShieldCheck, Truck, Award, Star, 
  ChevronLeft, Eye, MessageCircle, Play,
  Zap, Users, Store as StoreIcon
} from 'lucide-react';
import api, { optimizeImage, getBlurPlaceholder } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

const MotionDiv = motion.div as any;

/**
 * خريطة الصور النخبوية - تستخدم Unsplash IDs لضمان أعلى جودة بصرية
 */
const CATEGORY_VISUALS: Record<string, string> = {
  'إلكترونيات': 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
  'أزياء وملابس': 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
  'ساعات': 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
  'عطور': 'https://images.unsplash.com/photo-1541643600914-78b084683601',
  'حقائب': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
  'أحذية': 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
  'نظارات': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
  'منزليات': 'https://images.unsplash.com/photo-1616489953149-8651543883c4',
};

const getCategoryImg = (cat: Category) => {
  // إذا كان الاسم موجوداً في الخريطة، نستخدم الصورة الاحترافية
  const eliteImg = CATEGORY_VISUALS[cat.name];
  if (eliteImg) return eliteImg;
  
  // وإلا نستخدم الصورة الأصلية من قاعدة البيانات
  return cat.imageUrl;
};

/**
 * بطاقة الفئة بتصميم "غلاف المجلة"
 */
const CategoryItem: React.FC<{ cat: Category; idx: number; priority?: boolean }> = ({ cat, idx, priority }) => {
  const displayImage = getCategoryImg(cat);
  
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.8 }}
      className="group relative aspect-[3/4] rounded-[3.5rem] overflow-hidden bg-slate-100 shadow-2xl transition-all duration-700 hover:-translate-y-4"
    >
      <Link href={`/products?category=${cat._id}`} className="block w-full h-full relative">
        <Image 
          src={optimizeImage(displayImage, 600)} 
          alt={cat.name} 
          fill 
          priority={priority}
          placeholder="blur"
          blurDataURL={getBlurPlaceholder()}
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
        <div className="absolute inset-0 border-[16px] border-white/0 group-hover:border-white/5 transition-all duration-700 pointer-events-none" />

        <div className="absolute bottom-12 inset-x-8 text-center space-y-4">
          <MotionDiv 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[8px] text-white font-black uppercase tracking-[0.4em]"
          >
            Explore Collection
          </MotionDiv>
          <h3 className="font-black text-white text-4xl tracking-tighter transition-all group-hover:text-emerald-400">
            {cat.name}
          </h3>
          <div className="w-12 h-1 bg-emerald-500 mx-auto rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </div>
      </Link>
    </MotionDiv>
  );
};

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=8'),
          api.get('/categories')
        ]);
        setNewArrivals(prodRes.data.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error("Home Interface Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-white selection:bg-emerald-500 selection:text-white">
      
      {/* 1. CINEMATIC HERO */}
      <section className="relative h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
        <MotionDiv 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="/images/reg.png" 
            alt="Furato Elite Concept" 
            fill 
            priority
            className="object-cover opacity-40 grayscale-[0.3]" 
            placeholder="blur"
            blurDataURL={getBlurPlaceholder()}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-white" />
        </MotionDiv>

        <div className="container mx-auto px-6 relative z-10">
          <MotionDiv 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-emerald-400 text-[9px] font-black tracking-[0.5em] uppercase mb-12">
              <Crown size={14} className="animate-pulse" /> The Sovereign Collective
            </div>
            
            <h1 className="text-[14vw] md:text-[11rem] font-black text-white leading-none tracking-tighter mb-16 select-none">
              FURATO <span className="text-emerald-400 italic font-light">ELITE</span>
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link href="/products" className="group relative inline-flex px-14 py-6 bg-white text-slate-950 rounded-full font-black text-lg transition-all hover:scale-105 hover:bg-emerald-500 hover:text-white items-center gap-4 shadow-2xl">
                <span>اقتنِ مجموعتك</span>
                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
              </Link>
              <Link href="/stores" className="px-14 py-6 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-full font-black text-lg hover:bg-white/10 transition-all">
                استكشف المتاجر
              </Link>
            </div>
          </MotionDiv>
        </div>

        <MotionDiv 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30"
        >
          <MoveDown size={32} strokeWidth={1} />
        </MotionDiv>
      </section>

      {/* 2. TRUST STATS BAR */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white shadow-[0_50px_100px_rgba(0,0,0,0.08)] rounded-[4rem] overflow-hidden border border-slate-100">
          <StatBox icon={<Truck size={28}/>} title="توصيل سيادي" desc="توصيل مخصص لعنوانك في الرقة خلال 24 ساعة" />
          <StatBox icon={<ShieldCheck size={28}/>} title="بروتوكول الأصالة" desc="مقتنيات مضمونة 100% من المصدر" border />
          <StatBox icon={<Users size={28}/>} title="نادي النخبة" desc="+5000 عضو يثقون في خياراتنا" />
        </div>
      </div>

      {/* 3. THE CURATED UNIVERSE (Categories) */}
      <section className="py-40 bg-white relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="space-y-4">
              <MotionDiv 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] block"
              >
                Curated Collections
              </MotionDiv>
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter">مجموعات مختارة</h2>
            </div>
            <Link href="/products" className="group flex items-center gap-3 text-slate-900 font-black text-lg hover:text-emerald-600 transition-colors">
              شاهد كافة الأقسام <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {categories.slice(0, 4).map((cat, idx) => (
              <CategoryItem key={cat._id} cat={cat} idx={idx} priority={idx < 2} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. LATEST ARRIVALS */}
      <section className="py-40 bg-slate-50 rounded-[6rem]">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-20">
            <div className="space-y-4">
              <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em]">New Prototype Arrivals</span>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter">أحدث المقتنيات</h2>
            </div>
            <Link href="/products" className="text-slate-400 font-bold hover:text-emerald-600 transition-colors flex items-center gap-2">عرض الكل <ArrowUpRight size={18} /></Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {newArrivals.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. VENDOR CALL TO ACTION */}
      <section className="container mx-auto px-6 py-40">
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-slate-950 rounded-[5rem] p-16 md:p-32 text-center relative overflow-hidden shadow-3xl"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px]" />
          
          <div className="relative z-10 space-y-12">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-2xl">
                <StoreIcon size={44} />
              </div>
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">انقل مقتنياتك <br /> إلى <span className="text-emerald-500 italic font-light">مستوى السيادة</span></h2>
            <p className="text-slate-400 text-2xl max-w-2xl mx-auto font-medium">نحن نوفر لك المنصة والجمهور والخدمات اللوجستية، أنت فقط وفر الجودة.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-8 pt-8">
              <Link href="/register?type=vendor" className="px-16 py-7 bg-white text-slate-950 rounded-3xl font-black text-xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl">
                سجل كشريك الآن
              </Link>
              <Link href="/contact" className="px-16 py-7 bg-white/5 border border-white/10 text-white rounded-3xl font-black text-xl hover:bg-white/10 transition-all">
                تواصل مع الإدارة
              </Link>
            </div>
          </div>
        </MotionDiv>
      </section>

    </div>
  );
}

function StatBox({ icon, title, desc, border }: { icon: React.ReactNode, title: string, desc: string, border?: boolean }) {
  return (
    <div className={`p-12 flex flex-col items-center text-center gap-5 hover:bg-slate-50 transition-colors duration-500 ${border ? 'md:border-x border-slate-100' : ''}`}>
      <div className="text-emerald-600 mb-2 p-4 bg-emerald-50 rounded-2xl">{icon}</div>
      <h4 className="font-black text-slate-900 text-xl tracking-tight">{title}</h4>
      <p className="text-slate-400 text-sm font-medium leading-relaxed">{desc}</p>
    </div>
  );
}


