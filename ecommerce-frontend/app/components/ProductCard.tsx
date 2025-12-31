
'use client';

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Sparkles, Check, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { optimizeImage, getBlurPlaceholder } from "@/lib/api";

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
  const categoryName = typeof product.category === 'object' ? product.category.name : 'مقتنيات فاخرة';

  const isList = layout === 'list';

  return (
    <MotionDiv 
      whileHover={{ y: isList ? 0 : -8, x: isList ? -6 : 0 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative bg-white overflow-hidden transition-all duration-500 border border-emerald-50 hover:shadow-[0_20px_50px_-15px_rgba(6,78,59,0.08)] ${
        isList ? 'rounded-[1.5rem] flex flex-row h-auto md:h-52' : 'rounded-[2.5rem] flex flex-col h-full'
      }`}
    >
      <Link href={`/products/${product._id}`} className={`block h-full w-full relative ${isList ? 'flex flex-row' : 'flex flex-col'}`}>
        
        {/* منطقة الصورة - مصغرة في وضع القائمة ومتموضعة يميناً (RTL) */}
        <div className={`relative overflow-hidden bg-[#F8FAFA] shrink-0 transition-all duration-500 ${
          isList ? 'w-32 md:w-52 aspect-square md:aspect-auto' : 'w-full aspect-square'
        }`}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            placeholder="blur"
            blurDataURL={getBlurPlaceholder()}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* شارات المنتج - تظهر بحجم أصغر في القائمة */}
          <div className="absolute top-3 right-3 z-20">
            {product.isBestSeller && (
              <div className="bg-emerald-950/90 backdrop-blur-md text-emerald-400 text-[7px] font-black px-2 py-1 rounded-full shadow-lg flex items-center gap-1 border border-emerald-400/20 uppercase">
                <Sparkles size={8} />
                <span>Elite</span>
              </div>
            )}
          </div>

          {/* زر السلة في وضع الشبكة فقط */}
          {!isList && (
            <div className="absolute inset-x-4 bottom-4 z-30 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out hidden md:block">
              <button 
                onClick={handleAddToCart}
                disabled={product.stockQuantity < 1}
                className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all shadow-xl ${
                  isAdded ? 'bg-emerald-500 text-white' : 'bg-emerald-950 text-white hover:bg-emerald-800'
                }`}
              >
                <ShoppingBag size={14} /> {isAdded ? 'تمت الإضافة' : 'إضافة للسلة'}
              </button>
            </div>
          )}
        </div>

        {/* تفاصيل المنتج - متموضعة يساراً (RTL) */}
        <div className={`flex flex-col text-right bg-white flex-1 p-5 md:p-7 transition-all duration-500 ${
          isList ? 'justify-center' : 'gap-3'
        }`}>
          <span className="text-[9px] font-black text-emerald-600/60 uppercase tracking-[0.2em] mb-1">
            {categoryName}
          </span>

          <h3 className={`font-bold text-emerald-950 leading-tight group-hover:text-emerald-700 transition-colors ${
            isList ? 'text-lg md:text-xl mb-2 line-clamp-1' : 'text-base md:text-[17px] line-clamp-2 min-h-[2.8rem]'
          }`}>
            {product.name}
          </h3>

          {isList && product.description && product.description.length > 0 && (
            <p className="text-slate-400 text-xs md:text-sm line-clamp-2 mb-4 hidden sm:block max-w-xl">
              {product.description[0]}
            </p>
          )}

          <div className={`flex items-end justify-between ${isList ? 'mt-auto' : 'mt-auto pt-4 border-t border-emerald-50/50'}`}>
             <div className="flex flex-col items-start">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">القيمة الاستثمارية</span>
                <div className="flex items-center gap-1">
                  <span className={`${isList ? 'text-2xl md:text-3xl' : 'text-xl'} font-black text-emerald-950 tracking-tighter`}>
                    ${currentPrice.toLocaleString()}
                  </span>
                </div>
             </div>
             
             {/* زر الإضافة المناسب لكل وضع */}
             <button 
                onClick={handleAddToCart}
                className={`transition-all flex items-center justify-center gap-2 ${
                  isList 
                  ? 'px-8 h-12 rounded-xl bg-emerald-950 text-white hover:bg-emerald-800 text-[10px] font-black uppercase tracking-widest shadow-lg' 
                  : `w-10 h-10 rounded-xl ${isAdded ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.div key="v" initial={{ scale: 0.5 }} animate={{ scale: 1 }}><Check size={16} /></motion.div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus size={16} />
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
