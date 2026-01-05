
'use client';

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Plus, Sparkles, Check, Star } from "lucide-react";
import { Product, Category } from "@/lib/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { optimizeImage, getBlurPlaceholder } from "@/lib/api";
import ShieldText from "@/components/ShieldText";

const MotionDiv = motion.div as any;

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const [isAdded, setIsAdded] = useState(false);
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
  const mainImage = optimizeImage(product.images?.[0] || '', 400); 
  
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
      className={`group relative bg-white overflow-hidden transition-all duration-500 border border-emerald-50 hover:shadow-[0_15px_40px_-15px_rgba(6,78,59,0.1)] ${
        isList ? 'rounded-[1.2rem] flex flex-row h-auto md:h-48' : 'rounded-[2rem] flex flex-col h-full'
      }`}
    >
      <Link href={`/products/${product._id}`} className={`block h-full w-full relative ${isList ? 'flex flex-row' : 'flex flex-col'}`}>
        
        {/* Image Section */}
        <div className={`relative overflow-hidden bg-stone-50 shrink-0 transition-all duration-500 ${
          isList ? 'w-28 md:w-48 aspect-square md:aspect-auto' : 'w-full aspect-square'
        }`}>
          <Image
            src={mainImage}
            alt={productName}
            fill
            placeholder="blur"
            blurDataURL={getBlurPlaceholder()}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            unoptimized={mainImage.startsWith('data:')}
          />
          <div className="absolute top-2 right-2 z-20">
            {product.isBestSeller && (
              <div className="bg-emerald-950/90 backdrop-blur-md text-amber-400 text-[7px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-amber-400/20 uppercase">
                <Sparkles size={8} />
                <span>Elite</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className={`flex flex-col text-right bg-white flex-1 p-4 md:p-6 transition-all duration-500 ${
          isList ? 'justify-center' : 'gap-1'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[8px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">
              <ShieldText text={categoryName} />
            </span>
            <div className="flex text-amber-500">
               <Star size={8} fill="currentColor" />
               <Star size={8} fill="currentColor" />
               <Star size={8} fill="currentColor" />
               <Star size={8} fill="currentColor" />
               <Star size={8} fill="currentColor" />
            </div>
          </div>

          {/* تم تعديل هذه الحاوية لضمان العرض السليم */}
          <div className={`font-bold text-emerald-950 leading-tight group-hover:text-emerald-700 transition-colors mb-2 min-h-[2.5rem] ${
            isList ? 'text-base md:text-lg line-clamp-1' : 'text-sm md:text-[15px] line-clamp-2'
          }`}>
            <ShieldText text={productName} className="block" />
          </div>

          <div className={`flex items-end justify-between ${isList ? 'mt-auto' : 'mt-auto pt-3 border-t border-emerald-50/50'}`}>
             <div className="flex flex-col items-start text-right">
                <span className="text-[8px] font-bold text-stone-400 uppercase tracking-tight">قيمة المقتنى</span>
                <div className="flex items-center gap-1">
                  <span className={`${isList ? 'text-xl md:text-2xl' : 'text-lg'} font-black text-emerald-950 tracking-tight`}>
                    ${currentPrice.toLocaleString()}
                  </span>
                </div>
             </div>
             
             <button 
                onClick={handleAddToCart}
                className={`transition-all flex items-center justify-center gap-2 ${
                  isList 
                  ? 'px-6 h-10 rounded-lg bg-emerald-950 text-white hover:bg-emerald-800 text-[9px] font-black uppercase tracking-widest shadow-lg' 
                  : `w-9 h-9 rounded-lg ${isAdded ? 'bg-amber-500 text-white shadow-amber-200 shadow-md' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.div key="v" initial={{ scale: 0.5 }} animate={{ scale: 1 }}><Check size={14} /></motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus size={14} />
                      {isList && <span className="hidden md:inline">اقتناء الآن</span>}
                    </div>
                  )}
                </AnimatePresence>
             </button>
          </div>
        </div>
      </Link>
    </MotionDiv>
  );
};

export default ProductCard;
