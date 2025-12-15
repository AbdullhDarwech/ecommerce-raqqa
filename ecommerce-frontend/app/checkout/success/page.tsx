'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-emerald-50"
      >
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-emerald-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">تم استلام طلبك بنجاح!</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          شكراً لتسوقك معنا. سنقوم بتجهيز طلبك وتوصيله إليك في أسرع وقت ممكن. يمكنك متابعة حالة الطلب من صفحة ملفك الشخصي.
        </p>

        <div className="space-y-3">
          <Link 
            href="/profile" 
            className="block w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30"
          >
            متابعة طلباتي
          </Link>
          <Link 
            href="/products" 
            className="block w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} /> متابعة التسوق
          </Link>
        </div>
      </motion.div>
    </div>
  );
}