'use client';

import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  // In a real app, fetch these stats from an API
  const stats = [
    { label: 'إجمالي الطلبات', value: '1,234', icon: <ShoppingCart className="text-white" size={24} />, color: 'bg-blue-500' },
    { label: 'إجمالي المستخدمين', value: '543', icon: <Users className="text-white" size={24} />, color: 'bg-emerald-500' },
    { label: 'المنتجات', value: '89', icon: <Package className="text-white" size={24} />, color: 'bg-purple-500' },
    { label: 'المبيعات هذا الشهر', value: '$12k', icon: <TrendingUp className="text-white" size={24} />, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على أداء المتجر</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-gray-200 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-900">أحدث الطلبات</h2>
             <Link href="/admin/orders" className="text-emerald-600 text-sm hover:underline">عرض الكل</Link>
           </div>
           <div className="text-center py-10 text-gray-400">
             مخطط بياني أو جدول مختصر هنا
           </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-900">الإجراءات السريعة</h2>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <Link href="/admin/products/add" className="p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-center font-bold">
                إضافة منتج
             </Link>
             <Link href="/admin/stores/add" className="p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-center font-bold">
                إضافة متجر
             </Link>
             <Link href="/admin/categories" className="p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-center font-bold">
                إدارة الفئات
             </Link>
             <Link href="/admin/users" className="p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors text-center font-bold">
                المستخدمين
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}