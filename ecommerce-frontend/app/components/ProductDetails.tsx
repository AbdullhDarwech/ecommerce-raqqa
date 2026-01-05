
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Star, Heart, ShoppingBag, Minus, Plus, 
  ShieldCheck, RefreshCw, CheckCircle, Truck, 
  Settings2, ArrowRight, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

const MotionDiv = motion.div as any;

export default function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (product.stockQuantity < 1) return;
    setIsAdding(true);
    // تأخير بسيط لمحاكاة الفخامة في المعالجة
    await new Promise(resolve => setTimeout(resolve, 600));
    addToCart(product, quantity, 'purchase');
    setIsAdding(false);
  };

  const categoryName = typeof product.category === 'object' ? product.category.name : 'مقتنيات فاخرة';

  return (
    <div className="py-8 md:py-12 max-w-7xl mx-auto">
      {/* Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between mb-10">
        <Link 
          href="/products" 
          className="group flex items-center gap-2 text-emerald-900/60 hover:text-emerald-600 transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          العودة للمعرض
        </Link>
        <button className="p-3 bg-stone-50 text-stone-400 hover:text-emerald-600 rounded-2xl transition-all">
          <Share2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

        {/* --- 1. GALLERY SECTION --- */}
        <div className="space-y-6">
          <MotionDiv 
            layoutId={`image-${product._id}`}
            className="relative w-full aspect-square rounded-[3rem] overflow-hidden bg-stone-50 border border-emerald-50 shadow-2xl group"
          >
            <Image
              src={activeImage || '/placeholder.png'}
              alt={product.name}
              fill
              priority
              className="object-contain p-8 md:p-16 transition-transform duration-1000 group-hover:scale-110"
              unoptimized
            />
            
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className={`absolute top-8 left-8 p-4 rounded-2xl shadow-xl z-10 transition-all ${
                isFavorite ? 'bg-rose-500 text-white' : 'bg-white/90 backdrop-blur-xl text-stone-400 hover:text-rose-500'
              }`}
            >
              <Heart className={isFavorite ? "fill-current" : ""} size={20} />
            </button>
            
            {product.isBestSeller && (
              <div className="absolute top-8 right-8 bg-emerald-950/90 text-amber-400 px-4 py-2 rounded-xl backdrop-blur-md border border-amber-400/20 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Star size={12} fill="currentColor" /> Elite Selection
              </div>
            )}
          </MotionDiv>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === img 
                    ? 'border-emerald-500 shadow-lg ring-4 ring-emerald-50' 
                    : 'border-transparent bg-stone-50 opacity-50 hover:opacity-100'
                }`}
              >
                <Image src={img} alt={`view-${i}`} fill className="object-cover p-2" unoptimized />
              </button>
            ))}
          </div>
        </div>

        {/* --- 2. INFO SECTION --- */}
        <div className="flex flex-col">
          <div className="mb-10 border-b border-stone-100 pb-10">
             <div className="flex items-center gap-3 mb-6">
               <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-2 ${product.stockQuantity > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                  {product.stockQuantity > 0 ? <CheckCircle size={12} /> : <Minus size={12} />}
                  {product.stockQuantity > 0 ? 'متوفر للاقتناء' : 'نفذت الكمية'}
               </span>
               <span className="w-1 h-1 bg-stone-200 rounded-full" />
               <span className="text-stone-400 text-[9px] font-black uppercase tracking-widest">{categoryName}</span>
             </div>

             <h1 className="text-4xl md:text-5xl font-black text-emerald-950 mb-8 leading-tight tracking-tighter">
               {product.name}
             </h1>
             
             <div className="flex items-center gap-8">
                <div className="flex flex-col">
                   <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">القيمة الحالية</span>
                   <div className="flex items-baseline gap-3">
                      <span className="text-5xl font-black text-emerald-600 tracking-tighter">
                        ${product.pricePurchase.toLocaleString()}
                      </span>
                      {product.priceOld && (
                         <span className="text-xl text-stone-300 line-through decoration-emerald-500/20">${product.priceOld}</span>
                      )}
                   </div>
                </div>
                <div className="h-10 w-px bg-stone-100" />
                <div className="flex flex-col">
                   <div className="flex text-amber-500 gap-0.5 mb-1">
                     {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                   </div>
                   <span className="text-stone-400 text-[9px] font-black tracking-widest">تقييم نُخبوي (4.9)</span>
                </div>
             </div>
          </div>

          {/* Properties Grid */}
          {product.properties && product.properties.length > 0 && (
            <div className="mb-10 bg-stone-50/50 rounded-[2rem] p-8 border border-stone-100">
              <h3 className="text-[10px] font-black text-emerald-950 mb-8 flex items-center gap-3 uppercase tracking-[0.3em]">
                <Settings2 size={16} className="text-amber-500" />
                المواصفات الفنية المعتمدة
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {product.properties.map((prop, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-stone-200/40 pb-3 group">
                    <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
                       {prop.key}
                    </span>
                    <span className="text-sm font-bold text-emerald-950">
                       {prop.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchase Controls */}
          <div className="space-y-8 mb-12">
             <div className="flex flex-col sm:flex-row gap-6">
               <div className="flex items-center bg-stone-50 rounded-2xl h-16 w-full sm:w-auto p-1.5 border border-stone-100 shadow-inner">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-full flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all"
                  >
                    <Minus size={20} />
                  </button>
                  <div className="w-14 h-full flex items-center justify-center font-black text-emerald-950 text-xl">
                     {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-full flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all"
                  >
                    <Plus size={20} />
                  </button>
               </div>

               <button
                 onClick={handleAddToCart}
                 disabled={product.stockQuantity < 1 || isAdding}
                 className={`flex-1 h-16 p-4 rounded-2xl font-black text-sm flex items-center justify-center gap-4 transition-all uppercase tracking-[0.2em] shadow-xl ${
                   product.stockQuantity < 1 
                   ? 'bg-stone-100 text-stone-300 cursor-not-allowed shadow-none'
                   : 'bg-emerald-950 text-white hover:bg-emerald-800 hover:shadow-emerald-900/20 active:scale-95'
                 }`}
               >
                  <AnimatePresence mode="wait">
                    {isAdding ? (
                      <motion.div 
                        key="loading"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: 360 }}
                        exit={{ opacity: 0 }}
                      >
                        <RefreshCw size={24} className="animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="content"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                      >
                        <ShoppingBag size={20} />
                        {product.stockQuantity > 0 ? 'اقتناء الآن' : 'غير متوفر'}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </button>
             </div>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-stone-100">
             <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <Truck size={22} />
                </div>
                <div>
                   <p className="font-black text-emerald-950 text-[10px] uppercase tracking-tighter">شحن سيادي</p>
                   <p className="text-[9px] text-stone-400 font-bold tracking-widest mt-0.5">خلال 24 ساعة</p>
                </div>
             </div>
             <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
                  <ShieldCheck size={22} />
                </div>
                <div>
                   <p className="font-black text-emerald-950 text-[10px] uppercase tracking-tighter">ضمان الأصالة</p>
                   <p className="text-[9px] text-stone-400 font-bold tracking-widest mt-0.5">100% موثق</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
