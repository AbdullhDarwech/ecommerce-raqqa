'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, ShoppingCart, Minus, Plus, ShieldCheck, RefreshCw, CheckCircle, Truck, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Category } from '@/lib/types';
import { useCart } from '@/context/CartContext';

const MotionDiv = motion.div as any;

export default function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.[0]);
  const [orderType, setOrderType] = useState<'purchase' | 'rental'>('purchase');
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (product.stockQuantity < 1) return;
    
    setIsAdding(true);
    // Simulate a small delay for better UX feeling
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToCart(product, quantity, orderType);
    setIsAdding(false);
  };

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  const currentPrice = orderType === 'purchase' ? product.pricePurchase : (product.priceRental || product.pricePurchase);
  
  // Safe Category Access
  const categoryName = typeof product.category === 'object' && product.category !== null 
    ? (product.category as Category).name 
    : 'عام';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-8">

      {/* ------------------------------
          🖼️ Image Gallery Section
      -------------------------------- */}
      <div className="space-y-6">
        <MotionDiv 
          layoutId={`image-${product._id}`}
          className="relative w-full aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group"
        >
          <Image
            src={activeImage || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          {product.discountPercentage && (
             <div className="absolute top-4 left-4 bg-rose-500 text-white font-bold px-3 py-1 rounded-full shadow-lg z-10">
                خصم {product.discountPercentage}%
             </div>
          )}
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-md z-10 transition-colors ${
              isFavorite ? 'bg-rose-50 text-rose-500' : 'bg-white text-gray-400 hover:text-rose-500'
            }`}
          >
            <Heart className={isFavorite ? "fill-current" : ""} size={20} />
          </button>
        </MotionDiv>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {product.images?.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                activeImage === img 
                  ? 'border-emerald-500 shadow-md ring-2 ring-emerald-100' 
                  : 'border-transparent bg-gray-50 opacity-70 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`img-${i}`} fill className="object-contain p-2" />
            </button>
          ))}
        </div>
      </div>

      {/* ------------------------------
          📄 Product Info Section
      -------------------------------- */}
      <div className="flex flex-col">
        <div className="mb-8 border-b border-gray-100 pb-8">
           <div className="flex items-center gap-3 mb-4">
             <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${product.stockQuantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                {product.stockQuantity > 0 ? <CheckCircle size={12} /> : <Minus size={12} />}
                {product.stockQuantity > 0 ? 'متوفر في المخزون' : 'نفذت الكمية'}
             </span>
             <span className="text-gray-300">|</span>
             <span className="text-gray-500 text-sm">{categoryName}</span>
           </div>

           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
           
           <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-400">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} className="fill-current" />)}
              </div>
              <span className="text-gray-400 text-sm font-medium">(4.5 تقييم)</span>
           </div>

           <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-emerald-600">
                ${currentPrice.toLocaleString()}
              </span>
              {product.priceOld && (
                 <span className="text-xl text-gray-400 line-through mb-2 decoration-2 decoration-rose-200">${product.priceOld}</span>
              )}
           </div>
        </div>

        {/* Controls */}
        <div className="space-y-6 mb-8">
           {/* Order Type Selector */}
           {product.priceRental && (
             <div className="bg-gray-50 p-1.5 rounded-xl inline-flex w-full md:w-auto">
               <button
                 onClick={() => setOrderType('purchase')}
                 className={`flex-1 md:flex-none md:w-32 py-2.5 text-sm font-bold rounded-lg transition-all text-center ${
                   orderType === 'purchase' ? 'bg-white shadow-sm text-gray-900 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 شراء
               </button>
               <button
                 onClick={() => setOrderType('rental')}
                 className={`flex-1 md:flex-none md:w-32 py-2.5 text-sm font-bold rounded-lg transition-all text-center ${
                   orderType === 'rental' ? 'bg-white shadow-sm text-gray-900 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'
                 }`}
               >
                 تأجير
               </button>
             </div>
           )}
        {product.properties  && (
            <div className="mb-14 bg-slate-50/70 backdrop-blur-sm rounded-[3rem] p-10 border border-slate-100 shadow-xl">
              <h3 className="text-xs font-black text-slate-900 mb-10 flex items-center gap-4 uppercase tracking-[0.4em]">
                <Settings2 size={20} className="text-emerald-500" />
                المواصفات الفنية المعتمدة
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8">
                {product.properties.map((prop, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-200/50 pb-4 group hover:border-emerald-200 transition-colors">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
                       {prop.key}
                    </span>
                    <span className="text-base font-bold text-slate-900">
                       {prop.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
           {/* Quantity & Add to Cart */}
           <div className="flex flex-col sm:flex-row gap-4">
             <div className="flex items-center border border-gray-200 rounded-xl h-14 w-full sm:w-auto">
                <button 
                  onClick={() => handleQuantity('dec')}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-r-xl transition-colors"
                >
                  <Minus size={20} />
                </button>
                <div className="w-12 h-full flex items-center justify-center font-bold text-gray-900 text-lg border-x border-gray-100">
                   {quantity}
                </div>
                <button 
                  onClick={() => handleQuantity('inc')}
                  className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-l-xl transition-colors"
                >
                  <Plus size={20} />
                </button>
             </div>

             <button
               onClick={handleAddToCart}
               disabled={product.stockQuantity < 1 || isAdding}
               className={`flex-1 h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${
                 product.stockQuantity < 1 
                 ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                 : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-emerald-500/30'
               }`}
             >
                {isAdding ? (
                  <RefreshCw className="animate-spin" size={24} />
                ) : (
                  <>
                    <ShoppingCart size={22} />
                    {product.stockQuantity > 0 ? 'إضافة للسلة' : 'غير متوفر'}
                  </>
                )}
             </button>
           </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-blue-700">
              <Truck size={24} />
              <div>
                 <p className="font-bold text-sm">توصيل سريع</p>
                 <p className="text-xs opacity-80">داخل الرقة خلال 24 ساعة</p>
              </div>
           </div>
           <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl text-emerald-700">
              <ShieldCheck size={24} />
              <div>
                 <p className="font-bold text-sm">جودة مضمونة</p>
                 <p className="text-xs opacity-80">منتجات أصلية 100%</p>
              </div>
           </div>
        </div>

        {/* Tabs: Description & Reviews */}
        <div className="mt-auto">
           <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 px-4 font-bold text-sm transition-all relative ${
                  activeTab === 'description' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                الوصف والمميزات
                {activeTab === 'description' && (
                  <MotionDiv layoutId="activeTab" className="absolute bottom-0 right-0 left-0 h-0.5 bg-emerald-600 rounded-t-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 px-4 font-bold text-sm transition-all relative ${
                  activeTab === 'reviews' ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                التقييمات ({product.reviews?.length || 0})
                {activeTab === 'reviews' && (
                  <MotionDiv layoutId="activeTab" className="absolute bottom-0 right-0 left-0 h-0.5 bg-emerald-600 rounded-t-full" />
                )}
              </button>
           </div>

           <div className="min-h-[150px]">
             <AnimatePresence mode="wait">
                {activeTab === 'description' ? (
                   <MotionDiv
                     key="desc"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="text-gray-600 leading-relaxed space-y-3"
                   >
                     {Array.isArray(product.description) && product.description.length > 0 ? (
                        product.description.map((line, idx) => (
                           <div key={idx} className="flex gap-2 items-start">
                              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0" />
                              <p>{line}</p>
                           </div>
                        ))
                     ) : (
                        <p>لا يتوفر وصف دقيق لهذا المنتج حالياً.</p>
                     )}
                   </MotionDiv>
                ) : (
                   <MotionDiv
                     key="reviews"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="space-y-4"
                   >
        

                     {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review) => (
                           <div key={review._id} className="bg-gray-50 p-4 rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                 <span className="font-bold text-gray-900">مستخدم</span>
                                 <div className="flex text-amber-400 text-xs">
                                    {Array.from({length: review.rating}).map((_, i) => <Star key={i} size={12} className="fill-current" />)}
                                 </div>
                              </div>
                              <p className="text-gray-600 text-sm">{review.comment}</p>
                           </div>
                        ))
                     ) : (
                        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                           <p>لا توجد تقييمات بعد.</p>
                           <button className="text-emerald-600 text-sm font-bold mt-2 hover:underline">كن أول من يقيم هذا المنتج</button>
                        </div>
                     )}
                   </MotionDiv>
                )}
                
             </AnimatePresence>
           </div>
        </div>

      </div>
    </div>
  );
}