'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType, Category } from '@/lib/types';
import { useCart } from '@/context/CartContext';

const MotionDiv = motion.div as any;

interface CartItemProps {
  item: CartItemType;
  refreshCart?: () => void; // Optional now as we use context
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const price = item.orderType === 'rental' 
    ? (item.product.priceRental || 0) 
    : item.product.pricePurchase;
  
  // Safe Category Access logic
  const categoryName = typeof item.product.category === 'object' && item.product.category !== null
    ? (item.product.category as Category).name 
    : 'عام';

  return (
    <MotionDiv 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className={`bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:shadow-md`}
    >
      {/* Product Image */}
      <Link href={`/products/${item.product._id}`} className="relative w-full sm:w-28 h-28 bg-gray-50 rounded-xl overflow-hidden shrink-0">
        <Image 
          src={item.product.images?.[0] || '/placeholder.png'} 
          alt={item.product.name} 
          fill 
          className="object-cover hover:scale-105 transition-transform duration-500"
          unoptimized
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <h3 className="font-bold text-gray-900 text-lg hover:text-emerald-600 transition-colors">
                 <Link href={`/products/${item.product._id}`}>{item.product.name}</Link>
               </h3>
               {item.orderType === 'rental' && (
                 <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">تأجير</span>
               )}
            </div>
            <p className="text-gray-500 text-sm mb-2">{categoryName}</p>
          </div>
          <p className="font-bold text-emerald-600 text-lg sm:hidden">${price.toLocaleString()}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          
          <div className="flex items-center gap-4">
             {/* Quantity Controls */}
             <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 h-10">
                <button 
                  onClick={() => updateQuantity(item.product._id, item.orderType, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-emerald-600 disabled:opacity-30 hover:bg-white rounded-r-lg transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="w-10 h-full flex items-center justify-center font-bold text-gray-800 text-sm border-x border-gray-200 bg-white relative">
                   {item.quantity}
                </div>
                <button 
                  onClick={() => updateQuantity(item.product._id, item.orderType, item.quantity + 1)}
                  className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-emerald-600 disabled:opacity-30 hover:bg-white rounded-l-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
             </div>

             <button 
                onClick={() => removeFromCart(item.product._id, item.orderType)}
                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
             >
                <Trash2 size={18} />
                <span className="hidden sm:inline">حذف</span>
             </button>
          </div>

          <div className="hidden sm:flex flex-col items-end">
             <span className="font-bold text-xl text-emerald-600">${(price * item.quantity).toLocaleString()}</span>
             {item.quantity > 1 && (
               <span className="text-xs text-gray-400">${price} / للقطعة</span>
             )}
          </div>

        </div>
      </div>
    </MotionDiv>
  );
}