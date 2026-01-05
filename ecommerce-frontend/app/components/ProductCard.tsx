'use client';

import React, { useState, useMemo } from "react";
// أزل import Image من next/image
import { Plus, Sparkles, Check, Star } from "lucide-react";
import { Product, Category } from "@/lib/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { optimizeImage } from "@/lib/api"; // أزل getBlurPlaceholder
import ShieldText from "@/components/ShieldText";

const MotionDiv = motion.div as any;

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (product.stockQuantity < 1) return;
    
    setIsAdded(true);
    addToCart(product, 1, 'purchase');
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  const currentPrice = product.pricePurchase;
  
  // تحسين دالة الصور
  const mainImage = useMemo(() => {
    if (!product.images?.[0]) return '/images/placeholder.png';
    
    const imageUrl = product.images[0];
    
    // استخدم الصورة مباشرة بدون optimization إذا كانت من unsplash
    if (imageUrl.includes('unsplash.com')) {
      // أزل الـ query parameters الزائدة
      const cleanUrl = imageUrl.split('?')[0];
      return `${cleanUrl}?auto=format&fit=crop&w=800&q=80`;
    }
    
    // إذا كانت من الـ backend
    if (imageUrl.includes('render.com') || imageUrl.startsWith('/uploads/')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-backend-2ssm.onrender.com';
      if (imageUrl.startsWith('/')) {
        return `${baseUrl}${imageUrl}`;
      }
      return imageUrl;
    }
    
    return imageUrl || '/images/placeholder.png';
  }, [product.images]);

  const categoryName = useMemo(() => {
    if (typeof product.category === 'object' && product.category !== null) {
      return (product.category as Category).name || 'مقتنيات فاخرة';
    }
    return typeof product.category === 'string' ? product.category : 'مقتنيات فاخرة';
  }, [product.category]);

  const productName = useMemo(() => {
    if (!product.name) return 'مقتنى سيادي';
    if (Array.isArray(product.name)) return product.name.join(' ');
    return String(product.name);
  }, [product.name]);

  const isList = layout === 'list';

  return (
    <MotionDiv 
      whileHover={{ y: isList ? 0 : -6, x: isList ? -4 : 0 }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative bg-white overflow-hidden transition-all duration-500 border border-emerald-50 hover:shadow-[0_25px_50px_-12px_rgba(6,78,59,0.12)] ${
        isList ? 'rounded-[1.2rem] flex flex-row h-auto md:h-48' : 'rounded-[1.5rem] md:rounded-[2.5rem] flex flex-col h-full'
      }`}
    >
      <Link href={`/products/${product._id}`} className={`block h-full w-full relative ${isList ? 'flex flex-row' : 'flex flex-col'}`}>
        
        {/* Image Section باستخدام img عادي */}
        <div className={`relative overflow-hidden bg-stone-50 shrink-0 transition-all duration-500 ${
          isList ? 'w-24 md:w-48 aspect-square md:aspect-auto' : 'w-full aspect-square'
        }`}>
          {/* استخدم img بدلاً من Image */}
          <img
            src={imageError ? '/images/placeholder.png' : mainImage}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Elite Badges */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            {product.isBestSeller && (
              <div className="bg-emerald-950/90 backdrop-blur-md text-amber-400 text-[7px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 border border-amber-400/20 uppercase tracking-widest">
                <Star size={10} fill="currentColor" />
                <span>Elite</span>
              </div>
            )}
          </div>

          {/* Quick Add Button */}
          {!isList && (
            <div className="absolute inset-x-0 bottom-0 z-30 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:block">
               <button 
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 rounded-2xl font-black text-[9px] uppercase tracking-[0.25em] shadow-2xl transition-all flex items-center justify-center gap-3 backdrop-blur-md border border-white/40 ${
                    isAdded 
                    ? 'bg-amber-500 text-white border-amber-400 shadow-amber-500/20' 
                    : 'bg-emerald-600 text-white'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <MotionDiv key="check" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2">
                        <Check size={14} /> تم الحفظ
                      </MotionDiv>
                    ) : (
                      <MotionDiv key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                        <Plus size={14} /> إضافة سريعة للسلة
                      </MotionDiv>
                    )}
                  </AnimatePresence>
               </button>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={`flex flex-col text-right bg-white flex-1 p-4 md:p-7 transition-all duration-500 ${
          isList ? 'justify-center' : 'gap-1'
        }`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] md:text-[9px] font-black text-emerald-600/60 uppercase tracking-[0.25em]">
              <ShieldText text={categoryName} />
            </span>
            {!isList && (
              <div className="flex text-amber-500">
                 <Star size={10} fill="currentColor" />
                 <Star size={10} fill="currentColor" />
                 <Star size={10} fill="currentColor" />
                 <Star size={10} fill="currentColor" />
                 <Star size={10} fill="currentColor" />
              </div>
            )}
          </div>

          <div className={`font-bold text-emerald-950 leading-tight group-hover:text-emerald-700 transition-colors mb-3 min-h-[2.5rem] md:min-h-[3rem] ${
            isList ? 'text-sm md:text-xl line-clamp-1' : 'text-xs md:text-[17px] line-clamp-2'
          }`}>
            <ShieldText text={productName} className="block" />
          </div>

          <div className={`flex items-end justify-between ${isList ? 'mt-auto' : 'mt-auto pt-3 md:pt-4 border-t border-emerald-50/50'}`}>
             <div className="flex flex-col items-start text-right">
                <span className="text-[8px] md:text-[9px] font-bold text-stone-400 uppercase tracking-tight mb-0.5">القيمة السيادية</span>
                <div className="flex items-center gap-1.5">
                  <span className={`${isList ? 'text-xl md:text-3xl' : 'text-sm md:text-2xl'} font-black text-emerald-950 tracking-tighter`}>
                    ${currentPrice.toLocaleString()}
                  </span>
                </div>
             </div>
             
             {/* Small Plus Button */}
             <button 
                onClick={handleAddToCart}
                className={`transition-all flex items-center justify-center gap-2 relative z-40 md:hidden ${
                  isAdded ? 'bg-amber-500 text-white' : 'bg-emerald-50 text-emerald-600'
                } w-10 h-10 rounded-xl shadow-sm`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <MotionDiv key="v2" initial={{ scale: 0.5 }} animate={{ scale: 1 }}><Check size={18} /></MotionDiv>
                  ) : (
                    <Plus size={18} />
                  )}
                </AnimatePresence>
             </button>

             {/* Action for List Layout */}
             {isList && (
               <button 
                 onClick={handleAddToCart}
                 className="px-6 py-3 bg-emerald-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hidden md:flex items-center gap-2 hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-950/10"
               >
                 {isAdded ? <Check size={14} /> : <Plus size={14} />}
                 {isAdded ? 'تمت الإضافة' : 'اقتناء الآن'}
               </button>
             )}
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
};

export default ProductCard;