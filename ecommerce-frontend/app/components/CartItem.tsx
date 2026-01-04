
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
      className={`bg-white p-4 rounded-3xl border border-emerald-50 shadow-sm flex flex-col sm:flex-row items-center gap-5 transition-all hover:shadow-md`}
    >
      {/* Product Image */}
      <Link href={`/products/${item.product._id}`} className="relative w-full sm:w-24 h-24 bg-stone-50 rounded-2xl overflow-hidden shrink-0 border border-stone-100">
        <Image 
          src={item.product.images?.[0] || '/placeholder.png'} 
          alt={item.product.name} 
          fill 
          className="object-cover p-2 hover:scale-110 transition-transform duration-700"
          unoptimized
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 w-full text-right">
        <div className="flex justify-between items-start mb-2">
          <div className="space-y-1">
             <span className="text-[8px] font-black text-emerald-600/60 uppercase tracking-widest">{categoryName}</span>
             <h3 className="font-bold text-emerald-950 text-base hover:text-emerald-600 transition-colors">
               <Link href={`/products/${item.product._id}`}>{item.product.name}</Link>
             </h3>
          </div>
          <button 
            onClick={() => removeFromCart(item.product._id, 'purchase')}
            className="text-stone-300 hover:text-rose-500 p-2 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-stone-50">
          <div className="flex items-center bg-stone-50 rounded-xl h-10 p-1 border border-stone-100">
            <button 
              onClick={() => updateQuantity(item.product._id, 'purchase', item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-emerald-600 disabled:opacity-20 transition-colors"
            >
              <Minus size={14} />
            </button>
            <div className="w-8 h-full flex items-center justify-center font-black text-emerald-950 text-xs">
               {item.quantity}
            </div>
            <button 
              onClick={() => updateQuantity(item.product._id, 'purchase', item.quantity + 1)}
              className="w-8 h-full flex items-center justify-center text-stone-400 hover:text-emerald-600 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="text-left">
             <span className="font-black text-lg text-emerald-600 tracking-tighter">${(price * item.quantity).toLocaleString()}</span>
             {item.quantity > 1 && (
               <p className="text-[9px] text-stone-400 font-bold tracking-tight">${price.toLocaleString()} / قطعة</p>
             )}
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}

export default CartItem;
