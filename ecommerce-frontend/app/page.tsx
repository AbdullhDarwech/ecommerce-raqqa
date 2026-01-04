
'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Crown, ShieldCheck, Truck, Users, 
  ChevronLeft, ChevronRight, Sparkles,
  TrendingUp, Package, Clock, Star, ArrowRight,
  MessageCircle, HeartHandshake ,ShieldAlert
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
    <div ref={containerRef} className="relative bg-white selection:bg-emerald-600 selection:text-white overflow-x-hidden min-h-screen">
      
      {/* 1. ELITE HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center bg-emerald-950 overflow-hidden">
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
            
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-8 select-none">
              FURATO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-200 to-emerald-500 italic font-medium">EXCELLENCE</span>
            </h1>

            <p className="text-emerald-50/70 text-sm md:text-base mb-10 max-w-lg mx-auto font-medium leading-relaxed">
              اكتشف عالم المنتجات الراقية حيث الجودة تلاقي الأناقة في كل تفصيل، تجربة نُخبوية صُممت لأجلك بلمسة من الفخامة الزمردية.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/products" className="group px-10 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs transition-all hover:bg-emerald-500 hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.4)] uppercase tracking-widest flex items-center gap-2">
                اكتشف المجموعات <TrendingUp size={16} />
              </Link>
              <Link href="/stores" className="px-10 py-4 border border-white/20 text-white hover:bg-white/10 rounded-2xl font-bold text-xs transition-all uppercase tracking-widest backdrop-blur-xl">
                شركاؤنا المعتمدون
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* 2. STATS RIBBON */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white/95 backdrop-blur-3xl shadow-[0_20px_50px_-10px_rgba(6,78,59,0.1)] rounded-[2rem] border border-emerald-50 overflow-hidden divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-emerald-50">
          <StatItem icon={<Truck className="text-emerald-600" />} title="شحن لوجستي" desc="توصيل سيادي خلال 24 ساعة" />
          <StatItem icon={<ShieldCheck className="text-amber-500" />} title="ميثاق الأصالة" desc="منتجات موثقة بشهادة جودة" />
          <StatItem icon={<Users className="text-teal-600" />} title="نادي الصفوة" desc="+5000 عميل يثقون بنا" />
        </div>
      </div>

      {/* 3. FEATURES SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em] block">Furato Protocol</span>
            <h2 className="text-3xl md:text-4xl font-black text-emerald-950 tracking-tight">لماذا تختار فوراتو ؟</h2>
            <div className="w-10 h-1 bg-amber-400 mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard icon={<Package className="text-emerald-600" />} title="تنوع نُخبوي" description="آلاف المنتجات المختارة بعناية من أرقى الماركات العالمية والمحلية." color="emerald" />
            <FeatureCard icon={<Clock className="text-amber-500" />} title="توصيل سيادي" description="نحن ندرك قيمة وقتك، لذا نصل إليك بأقصى سرعة ممكنة وبكل أمان." color="amber" />
            <FeatureCard icon={<Star className="text-teal-600" />} title="جودة استثمارية" description="كل قطعة تمر عبر فحص دقيق لضمان مطابقتها لمعاييرنا الصارمة." color="teal" />
            <FeatureCard icon={<Sparkles className="text-cyan-600" />} title="خدمة نُخبوية" description="دعم فني وتواصل مباشر لضمان رضاكم التام قبل وبعد عملية الشراء." color="cyan" />
          </div>
        </div>
      </section>

      {/* 4. CURATED COLLECTIONS */}
      <section className="py-20 bg-stone-50/50">
        <div className="container mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-right">
             <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.4em]">Sovereign Selections</span>
             <h2 className="text-3xl md:text-4xl font-black text-emerald-950 tracking-tight">المجموعات المختارة</h2>
          </div>
          <div className="flex gap-3">
             <button onClick={() => scrollCarousel('right')} className="w-10 h-10 rounded-xl border border-emerald-100 bg-white flex items-center justify-center text-emerald-900 shadow-sm hover:bg-emerald-50 transition-all"><ChevronRight size={18}/></button>
             <button onClick={() => scrollCarousel('left')} className="w-10 h-10 rounded-xl border border-emerald-100 bg-white flex items-center justify-center text-emerald-900 shadow-sm hover:bg-emerald-50 transition-all"><ChevronLeft size={18}/></button>
          </div>
        </div>

        <div ref={carouselRef} className="flex gap-6 px-6 md:px-12 overflow-x-auto no-scrollbar pb-10 snap-x scroll-smooth">
          {loading ? (
            [1,2,3,4,5].map(i => <div key={i} className="shrink-0 w-[75vw] md:w-[22vw] aspect-[4/5] bg-stone-100 rounded-[2rem] animate-pulse" />)
          ) : categories.map((cat) => (
            <MotionDiv key={cat._id} whileHover={{ y: -6 }} className="shrink-0 w-[75vw] md:w-[22vw] aspect-[4/5] relative rounded-[2rem] overflow-hidden snap-center group shadow-lg border border-emerald-50">
              <Link href={`/products?category=${cat._id}`} className="block w-full h-full">
                <Image 
                  src={optimizeImage(cat.imageUrl, 500)} 
                  alt={cat.name} 
                  fill 
                  sizes="(max-width: 768px) 75vw, 22vw"
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110" 
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/10 to-transparent" />
                <div className="absolute bottom-8 inset-x-6 text-center">
                   <h3 className="text-white text-lg md:text-xl font-bold tracking-tight mb-2">{cat.name}</h3>
                   <div className="w-8 h-0.5 bg-amber-400 mx-auto rounded-full group-hover:w-full transition-all duration-700" />
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="py-20 bg-emerald-950 relative overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16 space-y-3">
              <span className="text-amber-400 font-black text-[10px] uppercase tracking-[0.5em]">The Elite Favorites</span>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">الأكثر مبيعاً</h2>
              <p className="text-emerald-50/50 max-w-lg mx-auto text-sm font-medium">مجموعة مختارة من المنتجات التي نالت استحسان النخبة.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="aspect-[3/4] bg-emerald-900/40 rounded-[2rem] animate-pulse" />)
              ) : bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
      </section>

      {/* 6. NEW ARRIVALS */}
      <section className="py-20 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
               <div className="w-8 h-1 bg-emerald-950 rounded-full" />
               <span className="text-emerald-950 font-black text-[10px] uppercase tracking-[0.4em]">Minted Recently</span>
             </div>
             <h2 className="text-3xl md:text-4xl font-black text-emerald-950 tracking-tight">وصل حديثاً <span className="text-amber-500">.</span></h2>
          </div>
          <Link href="/products" className="group flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest pb-1 border-b-2 border-emerald-50 hover:border-emerald-600 transition-all">
             عرض كافة المنتجات <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {loading ? (
             [1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] bg-stone-50 rounded-3xl animate-pulse" />)
          ) : newArrivals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. CTA SECTION - REGISTER AS PARTNER (Bespoke Direct Invite) */}
      <section className="py-24 bg-white relative">
         <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="max-w-4xl mx-auto bg-emerald-950 rounded-[4rem] p-12 md:p-20 shadow-[0_40px_100px_-20px_rgba(6,78,59,0.4)] relative overflow-hidden border border-white/5">
               
               <MotionDiv 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative z-10 space-y-12"
               >
                 <div className="space-y-4">
                   <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[9px] font-black uppercase tracking-[0.4em] mb-4">
                     <Users size={12} /> Partner Program
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                     سجل <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 italic">كشريك</span>
                   </h2>
                   <p className="text-emerald-50/60 text-sm md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                     هل تمتلك مقتنيات نادرة أو علامة تجارية تبحث عن التميز؟ <br /> 
                     نحن نفتح أبواب "فوراتو" لنخبة المتاجر في الرقة لعرض منتجاتهم في بيئة رقمية تليق بالفخامة.
                   </p>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-8 bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-12 h-12 bg-amber-400/20 rounded-full flex items-center justify-center text-amber-400"><HeartHandshake size={24} /></div>
                       <span className="text-white text-[10px] font-black uppercase tracking-widest">تواصل مباشر</span>
                    </div>
                    <div className="hidden sm:block h-12 w-px bg-white/10" />
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-12 h-12 bg-emerald-400/20 rounded-full flex items-center justify-center text-emerald-400"><TrendingUp size={24} /></div>
                       <span className="text-white text-[10px] font-black uppercase tracking-widest">نمو استثماري</span>
                    </div>
                    <div className="hidden sm:block h-12 w-px bg-white/10" />
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center text-blue-400"><ShieldCheck size={24} /></div>
                       <span className="text-white text-[10px] font-black uppercase tracking-widest">موثوقية تامة</span>
                    </div>
                 </div>

                 <div className="flex flex-col items-center gap-6">
                    <a 
                      href="https://wa.me/963930904315?text=مرحباً، أود الاستفسار عن بروتوكول الشراكة مع فوراتو."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative px-12 py-6 bg-amber-500 text-emerald-950 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-amber-400 transition-all shadow-[0_20px_50px_-10px_rgba(245,158,11,0.5)] flex items-center gap-4 active:scale-95"
                    >
                      تواصل مع قسم الشراكات
                      <MessageCircle size={20} fill="currentColor" className="transition-transform group-hover:rotate-12" />
                    </a>
                    <p className="text-emerald-50/40 text-[9px] font-black uppercase tracking-[0.3em]">Direct Communication Protocol via WhatsApp</p>
                 </div>
               </MotionDiv>

               {/* Cinematic Decorative Layers */}
               <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 blur-[120px] -translate-x-1/2 -translate-y-1/2" />
               <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 blur-[120px] translate-x-1/2 translate-y-1/2" />
            </div>
         </div>
      </section>

      {/* 8. ELITE FLOATING WHATSAPP (Pulse Rings Animation) */}
      <div className="fixed bottom-5 left-5 z-[100]">
        <a
          href="https://wa.me/963930904315"
          target="_blank"
          rel="noopener noreferrer"
          className="relative block group"
        >
          {/* Layered Pulse Rings - Advanced CSS/Tailwind Animation */}
          <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-[-2px] rounded-full bg-[#25D366] opacity-20 animate-pulse " />
          <div className="absolute inset-[-2px] rounded-full bg-[#25D366] opacity-5 animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div className="relative bg-[#25D366] text-white p-3 rounded-full shadow-[0_20px_40px_-10px_rgba(37,211,102,0.6)] hover:shadow-[0_25px_50px_-10px_rgba(37,211,102,0.8)] hover:scale-110 active:scale-95 transition-all duration-500 flex items-center justify-center border-2 border-white/20">
            <MessageCircle size={20} fill="white" className="transition-transform group-hover:rotate-12" />
            
            {/* Elite Floating Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 pointer-events-none">
               <div className="relative bg-emerald-950 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-2xl shadow-3xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 whitespace-nowrap border border-emerald-500/20">
                  تواصل سيادي مباشر
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-[10px] border-transparent border-t-emerald-950" />
               </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

function StatItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 md:p-10 text-center space-y-4 hover:bg-emerald-50/30 transition-all duration-500 group">
       <div className="flex justify-center group-hover:scale-110 transition-transform duration-500">
         {React.cloneElement(icon as React.ReactElement, { size: 36, strokeWidth: 1.5 })}
       </div>
       <div className="space-y-1">
         <h4 className="font-bold text-emerald-950 text-lg tracking-tight">{title}</h4>
         <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.2em]">{desc}</p>
       </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  const colorMap: any = {
    emerald: 'bg-emerald-50 border-emerald-100',
    amber: 'bg-amber-50 border-amber-100',
    teal: 'bg-teal-50 border-teal-100',
    cyan: 'bg-cyan-50 border-cyan-100'
  };

  return (
    <div className={`p-8 rounded-[2rem] border-2 ${colorMap[color]} hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group`}>
       <div className="mb-6 flex justify-center lg:justify-start group-hover:scale-110 transition-transform duration-500">
         {React.cloneElement(icon as React.ReactElement, { size: 32, strokeWidth: 1.5 })}
       </div>
       <h4 className="font-black text-emerald-950 text-base mb-3 tracking-tight">{title}</h4>
       <p className="text-stone-500 text-xs leading-relaxed font-medium">{description}</p>
    </div>
  );
}
