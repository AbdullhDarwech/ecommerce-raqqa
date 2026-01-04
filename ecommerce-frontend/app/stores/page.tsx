
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Star, Store as StoreIcon, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '@/lib/api';
import { Store } from '@/lib/types';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores');
        const activeStores = Array.isArray(res.data) 
          ? res.data.filter((s: Store) => s.isActive) 
          : [];
        setStores(activeStores);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. CINEMATIC HEADER */}
      <section className="relative pt-40 pb-24 bg-emerald-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute -bottom-1 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-amber-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8 shadow-2xl"
          >
            <Sparkles size={12} /> The Sovereign Network
          </MotionDiv>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-8">
            شركاء <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">السيادة</span>
          </h1>
          
          <p className="text-emerald-50/60 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed">
            استكشف نخبة المتاجر المعتمدة التي تشاركنا ميثاق الجودة والأصالة في الرقة.
          </p>
        </div>
      </section>

      {/* 2. STORES GRID */}
      <section className="py-24 container mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-stone-50 rounded-[3rem] h-[500px] animate-pulse border border-emerald-50/50" />
            ))}
          </div>
        ) : stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {stores.map((store, index) => (
              <Link key={store._id} href={`/products?store=${store._id}`}>
                <MotionDiv
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  whileHover={{ y: -10 }}
                  className="group relative bg-white rounded-[3rem] border border-emerald-50 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(6,78,59,0.12)] transition-all duration-500 flex flex-col h-full cursor-pointer"
                >
                  {/* Cover Image */}
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <Image
                      src={store.coverImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000'}
                      alt={store.name}
                      fill
                      className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Logo & Info */}
                  <div className="px-8 pb-8 flex-1 flex flex-col relative">
                    <div className="relative -mt-12 mb-6">
                      <div className="w-24 h-24 rounded-[1.5rem] bg-white p-1 shadow-2xl inline-block overflow-hidden border border-emerald-50">
                         <Image
                          src={store.logo || '/placeholder.png'}
                          alt={store.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-[1.2rem]"
                          unoptimized
                        />
                      </div>
                    </div>

                    <div className="space-y-4 flex-1">
                      <h2 className="text-2xl font-black text-emerald-950 group-hover:text-emerald-700 transition-colors tracking-tight">
                        {store.name}
                      </h2>

                      <div className="flex flex-wrap gap-2">
                         <div className="flex items-center gap-1.5 text-[9px] font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-amber-200/50">
                            <ShieldCheck size={12} />
                            <span>متجر سيادي معتمد</span>
                         </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        {store.description && store.description.length > 0 && (
                           <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed font-medium">
                              {store.description[0]}
                           </p>
                        )}
                        
                        <div className="space-y-2.5 text-xs text-stone-400 font-bold uppercase tracking-tight">
                          {store.address && (
                            <div className="flex items-center gap-3">
                              <MapPin size={16} className="text-emerald-500 shrink-0" />
                              <span className="line-clamp-1">{store.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-10">
                      <div className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-950 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl group-hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-950/10">
                        تصفح معرض المنتجات
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-stone-50/50 rounded-[4rem] border-2 border-dashed border-stone-200">
            <h3 className="text-2xl font-black text-emerald-950 mb-4">لا توجد متاجر حالياً</h3>
            <Link href="/" className="px-10 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] shadow-xl">العودة للرئيسية</Link>
          </div>
        )}
      </section>
    </div>
  );
}
