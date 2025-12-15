'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { MapPin, Phone, User, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: '',
    city: 'الرقة',
    notes: ''
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  const shippingCost = cartTotal > 500 ? 0 : 25;
  const finalTotal = cartTotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (cartItems.length === 0) {
      setError('السلة فارغة!');
      setLoading(false);
      return;
    }

    try {
      // تجهيز البيانات: إرسال معرف المنتج والكمية والنوع
      const itemsPayload = cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        orderType: item.orderType
      }));

      const orderData = {
        items: itemsPayload, // إرسال المنتجات هنا
        totalPrice: finalTotal,
        deliveryAddress: {
          city: formData.city,
          street: formData.address,
          details: formData.notes
        },
        phone: formData.phone
      };

      await api.post('/orders', orderData);
      
      clearCart();
      router.push('/checkout/success');
    } catch (err: any) {
      console.error("Order submit error:", err);
      const errorMsg = err.response?.data?.error || err.message || 'حدث خطأ غير متوقع أثناء إتمام الطلب.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">إتمام الطلب</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Checkout Form */}
        <div className="lg:w-2/3">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-emerald-600" />
              عنوان التوصيل
            </h2>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3 text-sm font-bold border border-red-100"
              >
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الاسم الكامل</label>
                  <div className="relative">
                    <User className="absolute right-4 top-3.5 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-emerald-500"
                      placeholder="محمد أحمد"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-4 top-3.5 text-gray-400" size={18} />
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-emerald-500"
                      placeholder="09..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">المدينة</label>
                <select 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                >
                  <option value="الرقة">الرقة</option>
                  <option value="ريف الرقة">ريف الرقة</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">العنوان التفصيلي</label>
                <textarea 
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 h-24 resize-none"
                  placeholder="اسم الشارع، رقم البناء، معلم قريب..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">ملاحظات إضافية (اختياري)</label>
                <input 
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
                  placeholder="وقت مفضل للتوصيل، تعليمات خاصة..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || cartItems.length === 0}
                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                تأكيد الطلب (${finalTotal.toLocaleString()})
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-28">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص الطلب</h3>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto custom-scrollbar">
              {cartItems.map((item) => (
                <div key={`${item.product._id}-${item.orderType}`} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                      {item.quantity}
                    </span>
                    <span className="text-gray-700 line-clamp-1 max-w-[150px]">{item.product.name}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${((item.orderType === 'rental' ? item.product.priceRental! : item.product.pricePurchase) * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>المجموع الفرعي</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>الشحن</span>
                <span>{shippingCost === 0 ? 'مجاني' : `$${shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-50">
                <span>الإجمالي</span>
                <span className="text-emerald-600">${finalTotal.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl mt-6 text-xs text-blue-700 leading-relaxed">
              <strong>ملاحظة:</strong> الدفع عند الاستلام. سنقوم بالتواصل معك لتأكيد الطلب قبل إرسال المندوب.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}