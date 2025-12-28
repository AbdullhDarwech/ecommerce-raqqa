
'use client';

import React, { useState } from "react";
import Image from "next/image";
import { Eye, Heart, ShoppingBag, X, Check, Star, Sparkles, ArrowUpRight, Plus } from "lucide-react";
import { Product, Category } from "@/lib/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { optimizeImage, getBlurPlaceholder } from "@/lib/api";

const MotionDiv = motion.div as any;

/**
 * ProductCard component for displaying a single product in a grid or list.
 * Explicitly typed as React.FC to handle intrinsic attributes like "key" correctly in TypeScript.
 */
interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
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
  // طلب حجم صغير جداً للشبكة لزيادة السرعة (400px كافية جداً)
  const mainImage = optimizeImage(product.images?.[0] || '', 400); 
  const categoryName = typeof product.category === 'object' ? product.category.name : 'مقتنيات فاخرة';

  return (
    <MotionDiv 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[3rem] overflow-hidden transition-all duration-500 h-full flex flex-col border border-slate-50"
    >
      <Link href={`/products/${product._id}`} className="block h-full flex flex-col relative">
        
        {/* MEDIA CONTAINER */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
          
          {/* Shimmer Effect while loading */}
          {!isLoaded && (
            <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
          )}

          <Image
            src={mainImage}
            alt={product.name}
            fill
            placeholder="blur"
            blurDataURL={getBlurPlaceholder()}
            onLoadingComplete={() => setIsLoaded(true)}
            // Sizes حاسمة جداً للسرعة: تخبر المتصفح بالعرض الحقيقي للصورة
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-all duration-700 ${isLoaded ? 'scale-100 blur-0' : 'scale-110 blur-xl'}`}
            loading="lazy"
          />

          <div className="absolute top-6 left-6 z-20">
            {product.isBestSeller && (
              <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[7px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                Elite Choice
              </span>
            )}
          </div>

          <div className="absolute inset-x-6 bottom-6 z-30 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <button 
              onClick={handleAddToCart}
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-[9px] uppercase tracking-widest bg-white/95 backdrop-blur-md text-slate-900 hover:bg-emerald-600 hover:text-white transition-all shadow-2xl"
            >
              <Plus size={14} /> {isAdded ? 'مضافة' : 'اضافة الى السلة'}
            </button>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="p-6 flex flex-col gap-2 text-right">
          <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">{categoryName}</span>
          <h3 className="font-black text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xl font-black text-slate-900 tracking-tighter">${currentPrice.toLocaleString()}</p>
        </div>
      </Link>
    </MotionDiv>
  );
};

export default ProductCard;