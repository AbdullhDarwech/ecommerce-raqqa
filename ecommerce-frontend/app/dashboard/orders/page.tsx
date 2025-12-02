'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Order } from '@/lib/types';

export default function DashboardOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(Array.isArray(res.data) ? res.data : []));
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-raqqa-river">الطلبات</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-xl shadow-lg">
            <p className="text-lg">الإجمالي: ${order.totalPrice}</p>
            <p className="text-gray-600">الحالة: {order.status}</p>
            <p className="text-gray-600">نوع الطلب: {order.orderType}</p>
          </div>
        ))}
      </div>
    </div>
  );
}