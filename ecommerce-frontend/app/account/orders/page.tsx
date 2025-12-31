'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">الطلبات</h1>
      <div className="space-y-4">
        {orders.map((order: any) => (
          <div key={order._id} className="border p-4 rounded">
            <p>الإجمالي: ${order.totalPrice}</p>
            <p>الحالة: {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}