'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

interface AdminStats {
  products: number;
  orders: number;
  users: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({ products: 0, orders: 0, users: 0 });
  const { adminToken } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!adminToken) return;

      const headers = { Authorization: `Bearer ${adminToken}` };

      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get('/admin/products', { headers }),
          api.get('/admin/orders', { headers }),
          api.get('/admin/users', { headers }),
        ]);

        setStats({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          users: usersRes.data.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [adminToken]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">إحصائيات المتجر</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">المنتجات</h3>
          <p className="text-2xl font-bold">{stats.products}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">الطلبات</h3>
          <p className="text-2xl font-bold">{stats.orders}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">المستخدمين</h3>
          <p className="text-2xl font-bold">{stats.users}</p>
        </div>
      </div>
    </div>
  );
}
