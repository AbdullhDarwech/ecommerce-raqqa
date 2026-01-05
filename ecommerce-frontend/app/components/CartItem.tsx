
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType, Category } from '@/lib/types';
import { useCart } from '@/context/CartContext';

const MotionDiv = motion.div as any;

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const price = item.product.pricePurchase;
  
  const categoryName = typeof item.product.category === 'object' && item.product.category !== null
    ? (item.product.category as Category).name 
    : 'مقتنيات فاخرة';

  return (
    <MotionDiv 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white p-4 lg:p-5 rounded-[2rem] border border-emerald-50 shadow-sm flex flex-row items-center gap-4 lg:gap-6 transition-all hover:shadow-md`}
    >
      {/* Product Image - Fixed size for mobile to prevent stretching */}
      <Link href={`/products/${item.product._id}`} className="relative w-20 h-20 sm:w-28 sm:h-28 bg-stone-50 rounded-2xl overflow-hidden shrink-0 border border-stone-100 p-2 group-hover:bg-white transition-colors">
        <Image 
          src={item.product.images?.[0] || '/placeholder.png'} 
          alt={item.product.name} 
          fill 
          className="object-contain p-1 hover:scale-110 transition-transform duration-700"
          unoptimized
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 text-right">
        <div className="flex justify-between items-start mb-1 lg:mb-2">
          <div className="space-y-0.5">
             <span className="text-[7px] lg:text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">{categoryName}</span>
             <h3 className="font-bold text-emerald-950 text-sm lg:text-lg hover:text-emerald-600 transition-colors line-clamp-1">
               <Link href={`/products/${item.product._id}`}>{item.product.name}</Link>
             </h3>
          </div>
          <button 
            onClick={() => removeFromCart(item.product._id, 'purchase')}
            className="text-stone-300 hover:text-rose-500 p-1.5 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 mt-2 lg:mt-4 pt-2 lg:pt-4 border-t border-stone-50">
          <div className="flex items-center bg-stone-50 rounded-xl h-9 lg:h-10 p-0.5 lg:p-1 border border-stone-100">
            <button 
              onClick={() => updateQuantity(item.product._id, 'purchase', item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-7 lg:w-8 h-full flex items-center justify-center text-stone-400 hover:text-emerald-600 disabled:opacity-20 transition-colors"
            >
              <Minus size={12} />
            </button>
            <div className="w-7 lg:w-8 h-full flex items-center justify-center font-black text-emerald-950 text-xs">
               {item.quantity}
            </div>
            <button 
              onClick={() => updateQuantity(item.product._id, 'purchase', item.quantity + 1)}
              className="w-7 lg:w-8 h-full flex items-center justify-center text-stone-400 hover:text-emerald-600 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="text-left">
             <span className="font-black text-base lg:text-xl text-emerald-600 tracking-tighter">${(price * item.quantity).toLocaleString()}</span>
             {item.quantity > 1 && (
               <p className="text-[8px] lg:text-[9px] text-stone-400 font-bold tracking-tight opacity-60">${price.toLocaleString()} / قطعة</p>
             )}
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}

export default CartItem;
