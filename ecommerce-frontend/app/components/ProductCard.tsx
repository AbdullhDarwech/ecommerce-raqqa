'use client';

import React, { useState } from "react";
import Image from "next/image";
import { Eye, GitCompare, Heart, ShoppingCart, X, Check, Star } from "lucide-react";
import { Product, Category } from "@/lib/types";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const MotionDiv = motion.div as any;

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  // Use the addToCart function from context
  const { addToCart } = useCart();

  const handleFavorite = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stockQuantity < 1) return;

    setIsAdded(true);
    
    // Perform the actual add to cart logic
    addToCart(product, 1, 'purchase');
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Safe access to category name
  const categoryName = typeof product.category === 'object' && product.category !== null 
    ? (product.category as Category).name 
    : 'عام';

  // Handle price display (purchase price as default)
  const currentPrice = product.pricePurchase;
  
  // Calculate discount if needed
  const discount = product.discountPercentage || (product.priceOld ? Math.round(((product.priceOld - currentPrice) / product.priceOld) * 100) : 0);

  return (
    <>
      <MotionDiv 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -5 }}
        className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 h-full flex flex-col"
      >
        <Link href={`/products/${product._id}`} className="block h-full flex flex-col">
          
          {/* Image Container */}
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-50">
            {discount > 0 && (
              <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                -{discount}%
              </span>
            )}
            
            <Image
              src={product.images?.[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              unoptimized
            />

            {/* Hover Actions (Right Side) */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
              <ActionButton 
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                icon={<Eye size={18} />}
                tooltip="نظرة سريعة"
              />
              <ActionButton 
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                icon={<GitCompare size={18} />}
                tooltip="مقارنة"
              />
              <ActionButton 
                onClick={handleFavorite}
                icon={<Heart size={18} className={isFavorite ? "fill-current" : ""} />}
                active={isFavorite}
                activeColor="text-rose-500"
                tooltip="المفضلة"
              />
            </div>

            {/* Add to Cart Button (Bottom Overlay) */}
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
              <button
                onClick={handleAddToCart}
                disabled={isAdded || product.stockQuantity < 1}
                className={`w-full py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 font-semibold text-sm transition-colors ${
                  isAdded 
                    ? "bg-emerald-600 text-white" 
                    : product.stockQuantity < 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-900 hover:bg-emerald-600 hover:text-white"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={18} /> تمت الإضافة
                  </>
                ) : product.stockQuantity < 1 ? (
                  <>
                    <X size={18} /> نفذت الكمية
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> أضف للسلة
                  </>
                )}
              </button>
            </div>
            
            {/* Overlay Gradient for readability on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
          </div>

          {/* Product Details */}
          <div className="p-4 flex flex-col gap-2 flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-600 transition-colors flex-1" title={product.name}>
                {product.name}
              </h3>
            </div>
             <p className="text-xs text-gray-500">{categoryName}</p>
            
            <div className="flex items-center justify-between mt-auto pt-2">
              <div className="flex flex-col">
                {product.priceOld && (
                   <span className="text-xs text-gray-400 line-through">${product.priceOld}</span>
                )}
                <span className="text-lg font-extrabold text-emerald-600">
                  ${currentPrice}
                </span>
              </div>
              
              {/* Rating Placeholder */}
              <div className="flex items-center gap-1">
                 <Star size={14} className="fill-amber-400 text-amber-400" />
                 <span className="text-xs font-medium text-gray-500">4.5</span>
              </div>
            </div>
          </div>
        </Link>
      </MotionDiv>

      {/* Quick View Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" dir="rtl">
            <MotionDiv 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <MotionDiv 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <button
                className="absolute top-4 left-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-red-500 transition-colors backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>

              {/* Modal Image */}
              <div className="w-full md:w-1/2 bg-gray-50 relative min-h-[300px] md:min-h-[500px]">
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  unoptimized
                />
              </div>

              {/* Modal Details */}
              <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                <div className="mb-auto">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">جديد</span>
                     <div className="flex text-amber-400 text-xs">
                        {[1,2,3,4,5].map(i => <Star key={i} size={12} className="fill-current" />)}
                     </div>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h2>
                  
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-3xl font-bold text-emerald-600">${currentPrice}</span>
                    {product.priceOld && (
                      <span className="text-lg text-gray-400 line-through mb-1">${product.priceOld}</span>
                    )}
                  </div>

                  <div className="text-gray-600 leading-relaxed mb-8 space-y-2">
                    {Array.isArray(product.description) ? (
                      product.description.slice(0, 3).map((desc, i) => (
                        <p key={i}>{desc}</p>
                      ))
                    ) : (
                      <p>لا يوجد وصف متاح.</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity < 1}
                    className={`flex-1 text-white py-4 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${
                        product.stockQuantity < 1 
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30'
                    }`}
                  >
                    <ShoppingCart size={20} />
                    {product.stockQuantity < 1 ? 'نفذت الكمية' : 'أضف إلى السلة'}
                  </button>
                  
                  <button
                    onClick={handleFavorite}
                    className={`p-4 rounded-xl border-2 transition-colors ${
                      isFavorite ? "border-rose-200 bg-rose-50 text-rose-500" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <Heart size={24} className={isFavorite ? "fill-current" : ""} />
                  </button>
                </div>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function ActionButton({ onClick, icon, tooltip, active = false, activeColor = "" }: any) {
  return (
    <button
      onClick={onClick}
      className={`group/btn relative p-2.5 rounded-full shadow-sm transition-all duration-200 ${
        active 
        ? `bg-white ${activeColor}` 
        : "bg-white text-gray-700 hover:bg-emerald-600 hover:text-white"
      }`}
    >
      {icon}
      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {tooltip}
      </span>
    </button>
  );
}