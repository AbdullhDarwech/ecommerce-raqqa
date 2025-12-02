'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Order } from '@/lib/types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.get('/admin/orders').then((res) => setOrders(res.data));
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    await api.put(`/admin/orders/${id}`, { status });
    setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">إدارة الطلبات</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>المستخدم</th>
            <th>الإجمالي</th>
            <th>الحالة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order.user.name}</td>
              <td>${order.totalPrice}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  className="border p-1"
                >
                  <option value="pending">معلق</option>
                  <option value="shipped">مرسل</option>
                  <option value="delivered">تم التسليم</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}