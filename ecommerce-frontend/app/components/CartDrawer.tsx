'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, LogIn, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const MotionDiv = motion.div as any;

export default function CartDrawer() {
  const { isCartOpen, closeCart, cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    closeCart();
    if (user) {
      router.push('/checkout');
    } else {
      router.push('/login?redirect=/checkout');
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer - Opens from Left */}
          <MotionDiv
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-full sm:w-[400px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-emerald-600" />
                <h2 className="text-lg font-bold">سلة المشتريات</h2>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                  {cartItems.length} منتجات
                </span>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => {
                  const price = item.orderType === 'rental' ? item.product.priceRental : item.product.pricePurchase;
                  return (
                    <div key={`${item.product._id}-${item.orderType}`} className="flex gap-3 border p-3 rounded-xl hover:shadow-md transition-shadow relative bg-white">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        <Image 
                          src={item.product.images?.[0] || '/placeholder.png'} 
                          alt={item.product.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                             <h3 className="font-semibold text-gray-800 line-clamp-1 text-sm">{item.product.name}</h3>
                             <button 
                                onClick={() => removeFromCart(item.product._id, item.orderType)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             <p className="text-emerald-600 font-bold text-sm">${price}</p>
                             {item.orderType === 'rental' && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">تأجير</span>}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 border rounded-lg px-1 bg-gray-50 h-8">
                             <button 
                                onClick={() => updateQuantity(item.product._id, item.orderType, item.quantity - 1)}
                                className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-emerald-600"
                             >
                                <Minus size={14} />
                             </button>
                             <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                             <button 
                                onClick={() => updateQuantity(item.product._id, item.orderType, item.quantity + 1)}
                                className="w-6 h-full flex items-center justify-center text-gray-500 hover:text-emerald-600"
                             >
                                <Plus size={14} />
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                     <ShoppingBag size={40} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500">سلتك فارغة حالياً</p>
                  <button onClick={closeCart} className="text-emerald-600 font-bold hover:underline">
                    تصفح المنتجات
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t bg-gray-50 safe-area-bottom pb-8 sm:pb-5">
                <div className="flex justify-between items-center mb-4 text-lg font-bold">
                  <span>المجموع:</span>
                  <span className="text-emerald-600">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={handleCheckout}
                    className={`block w-full text-white text-center py-3.5 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                      user 
                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" 
                        : "bg-gray-800 hover:bg-gray-900 shadow-gray-500/20"
                    }`}
                  >
                    {user ? (
                      "إتمام الطلب"
                    ) : (
                      <>
                        <LogIn size={18} /> سجل دخولك للإتمام
                      </>
                    )}
                  </button>
                  
                  <Link 
                    href="/cart"
                    onClick={closeCart}
                    className="block w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-center py-3.5 rounded-xl font-bold transition-all"
                  >
                    عرض السلة الكاملة
                  </Link>
                </div>
              </div>
            )}
          </MotionDiv>
        </>
      )}
    </AnimatePresence>
  );
}