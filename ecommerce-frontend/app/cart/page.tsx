'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, CreditCard, ShieldCheck, Truck, AlertCircle } from 'lucide-react';
import CartItem from '@/components/CartItem';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/context/CartContext';

const MotionDiv = motion.div as any;

export default function CartPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const shippingCost = cartTotal > 500 ? 0 : 0; 
  const total = cartTotal + shippingCost;

  const handleCheckout = () => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-emerald-600" />
          سلة المشتريات
          <span className="text-sm font-normal text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
            {cartItems.length} منتجات
          </span>
        </h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Cart Items Column */}
            <div className="lg:w-2/3 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <CartItem 
                    key={`${item.product._id}-${item.orderType}`} 
                    item={item} 
                    // refreshCart is handled by Context now, passing no-op or removing prop from component
                    refreshCart={() => {}} 
                  />
                ))}
              </AnimatePresence>
              
              <div className="flex justify-end mt-4">
                 <button 
                   onClick={clearCart}
                   className="text-red-500 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                 >
                   إفراغ السلة
                 </button>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <h2 className="text-xl font-bold text-gray-900 mb-6">ملخص الطلب</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>المجموع الفرعي</span>
                    <span className="font-medium">${cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>الشحن</span>
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 font-medium">مجاني</span>
                    ) : (
                      <span className="font-medium">${shippingCost}</span>
                    )}
                  </div>
                  <div className="h-px bg-gray-100 my-2" />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>الإجمالي</span>
                    <span className="text-emerald-600">${total.toLocaleString()}</span>
                  </div>
                </div>

                {!user && (
                   <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-2 text-sm text-amber-800">
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      <p>يجب عليك تسجيل الدخول لإتمام عملية الشراء.</p>
                   </div>
                )}

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
                >
                  {user ? (
                    <>متابعة الدفع <CreditCard size={20} /></>
                  ) : (
                    <>تسجيل الدخول للمتابعة <ArrowLeft size={20} /></>
                  )}
                </button>

                <div className="mt-6 flex flex-col gap-3 text-sm text-gray-500">
                   <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-500" />
                      <span>دفع آمن ومحمي 100%</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Truck size={16} className="text-emerald-500" />
                      <span>توصيل سريع داخل الرقة</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 text-center"
          >
            <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">سلتك فارغة</h2>
            <p className="text-gray-500 mb-8 max-w-md">لم تقم بإضافة أي منتجات للسلة بعد. تصفح متجرنا واستكشف أفضل العروض.</p>
            <Link 
              href="/products" 
              className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/30"
            >
              تسوق الآن
            </Link>
          </MotionDiv>
        )}
      </div>
    </div>
  );
}