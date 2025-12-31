'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { ShoppingCart, Heart, Package } from 'lucide-react';

interface UserStats {
  orders: number;
  favorites: number;
  productsViewed: number;
}

export default function UserDashboard() {  // تأكد من وجود export default
  const [stats, setStats] = useState<UserStats>({ orders: 0, favorites: 0, productsViewed: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, favoritesRes] = await Promise.all([
          api.get('/orders'),
          api.get('/users/favorites'),
        ]);
        setStats({
          orders: ordersRes.data.length,
          favorites: favoritesRes.data.length,
          productsViewed: 10, // مثال
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-raqqa-river">مرحباً بك في Dashboard الخاص بك</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-raqqa-green to-raqqa-river p-6 rounded-xl shadow-lg text-white">
          <ShoppingCart size={40} className="mb-4" />
          <h3 className="text-2xl font-semibold">الطلبات</h3>
          <p className="text-4xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-gradient-to-r from-raqqa-river to-raqqa-green p-6 rounded-xl shadow-lg text-white">
          <Heart size={40} className="mb-4" />
          <h3 className="text-2xl font-semibold">المفضلة</h3>
          <p className="text-4xl font-bold">{stats.favorites}</p>
        </div>
        <div className="bg-gradient-to-r from-raqqa-sand to-raqqa-green p-6 rounded-xl shadow-lg text-black">
          <Package size={40} className="mb-4" />
          <h3 className="text-2xl font-semibold">المنتجات المُشاهدة</h3>
          <p className="text-4xl font-bold">{stats.productsViewed}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">النشاط الأخير</h2>
        <ul className="space-y-2">
          <li className="bg-gray-100 p-4 rounded-lg">تم إضافة منتج إلى السلة</li>
          <li className="bg-gray-100 p-4 rounded-lg">تم تحديث الطلب رقم 123</li>
          <li className="bg-gray-100 p-4 rounded-lg">تم إضافة منتج إلى المفضلة</li>
        </ul>
      </div>
    </div>
  );
}
