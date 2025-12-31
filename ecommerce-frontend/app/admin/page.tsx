
'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Store, 
  Loader2, 
  DollarSign, 
  Activity,
  ArrowUpRight, 
  Clock, 
  ChevronLeft 
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    stores: 0,
    revenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes, storesRes] = await Promise.all([
          api.get('/admin/products'),
          api.get('/admin/orders'),
          api.get('/admin/users'),
          api.get('/admin/stores')
        ]);

        const orders = ordersRes.data || [];
        const totalRevenue = orders
          .filter((o: any) => o.status === 'delivered')
          .reduce((acc: number, order: any) => acc + (order.totalPrice || 0), 0);
        
        const pending = orders.filter((o: any) => o.status === 'pending').length;

        setStats({
          products: Array.isArray(productsRes.data) ? productsRes.data.length : productsRes.data.data?.length || 0,
          orders: orders.length,
          users: usersRes.data.length,
          stores: storesRes.data.length,
          revenue: totalRevenue,
          pendingOrders: pending
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  const statCards = [
    { label: 'إجمالي المبيعات', value: `$${stats.revenue.toLocaleString()}`, icon: <DollarSign className="text-emerald-600" size={24} />, color: 'bg-emerald-50', trend: '+12%', trendUp: true },
    { label: 'الطلبات المعلقة', value: stats.pendingOrders, icon: <Clock className="text-amber-600" size={24} />, color: 'bg-amber-50', trend: 'عاجل', trendUp: false },
    { label: 'عدد المستخدمين', value: stats.users, icon: <Users className="text-blue-600" size={24} />, color: 'bg-blue-50', trend: '+5%', trendUp: true },
    { label: 'المتاجر النشطة', value: stats.stores, icon: <Store className="text-purple-600" size={24} />, color: 'bg-purple-50', trend: 'نمو مستقر', trendUp: true },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">نظرة عامة</h1>
          <p className="text-gray-500 mt-2 font-medium">مرحباً بك في لوحة تحكم سوق الرقة</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-bold text-gray-600">
           <Activity size={16} className="text-emerald-500" /> حالة النظام: متصل
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <MotionDiv 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black px-2 py-1 rounded-lg ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-500'}`}>
                {stat.trendUp ? <ArrowUpRight size={12} /> : null}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-gray-500 font-bold text-sm mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
            </div>
          </MotionDiv>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
              <h2 className="text-2xl font-black mb-2">أداء المبيعات</h2>
              <p className="text-gray-400 mb-10 font-medium">مقارنة أسبوعية لأداء المتجر</p>
              <div className="h-48 flex items-end gap-4">
                 {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                   <div key={i} className="flex-1 group relative">
                      <MotionDiv 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="bg-emerald-500 rounded-t-xl group-hover:bg-emerald-400 transition-colors"
                      />
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col">
           <h2 className="text-2xl font-black text-gray-900 mb-8">إجراءات سريعة</h2>
           <div className="space-y-4 flex-1">
              <QuickActionLink href="/admin/products/add" label="إضافة منتج جديد" icon={<Package size={20} />} color="bg-emerald-600" />
              <QuickActionLink href="/admin/stores/add" label="تسجيل متجر جديد" icon={<Store size={20} />} color="bg-blue-600" />
              <QuickActionLink href="/admin/orders" label="مراجعة الطلبات" icon={<ShoppingCart size={20} />} color="bg-amber-600" />
           </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionLink({ href, label, icon, color }: any) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
    >
      <div className={`w-12 h-12 ${color} text-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <span className="font-bold text-gray-700">{label}</span>
      <ChevronLeft size={16} className="mr-auto text-gray-300 group-hover:text-gray-600" />
    </Link>
  );
}
