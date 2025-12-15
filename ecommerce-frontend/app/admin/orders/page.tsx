'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Order } from '@/lib/types';
import { Loader2, CheckCircle, Clock, Truck } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setStatusUpdating(id);
    try {
      await api.put(`/admin/orders/${id}`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status: status as any } : o));
    } catch (error) {
      alert('فشل تحديث الحالة');
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14} /> تم التوصيل</span>;
      case 'shipped': return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold"><Truck size={14} /> جاري الشحن</span>;
      default: return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14} /> قيد الانتظار</span>;
    }
  };

  if (loading) return <div className="text-center py-12">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">الطلبات</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">رقم الطلب</th>
                <th className="px-6 py-4 font-bold text-gray-700">العميل</th>
                <th className="px-6 py-4 font-bold text-gray-700">المجموع</th>
                <th className="px-6 py-4 font-bold text-gray-700">الحالة</th>
                <th className="px-6 py-4 font-bold text-gray-700">تاريخ الطلب</th>
                <th className="px-6 py-4 font-bold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-gray-500">#{order._id.slice(-6)}</td>
                  <td className="px-6 py-4 font-bold">
                     {/* Safe check for user object as it might be populated or ID */}
                     {typeof order.user === 'object' ? (order.user as any).name : 'مستخدم'}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">${order.totalPrice}</td>
                  <td className="px-6 py-4">
                     {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                         disabled={statusUpdating === order._id}
                         value={order.status}
                         onChange={(e) => updateStatus(order._id, e.target.value)}
                         className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:border-emerald-500 outline-none"
                      >
                         <option value="pending">انتظار</option>
                         <option value="shipped">شحن</option>
                         <option value="delivered">توصيل</option>
                         <option value="cancelled">إلغاء</option>
                      </select>
                      {statusUpdating === order._id && <Loader2 size={16} className="animate-spin text-emerald-600" />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {orders.length === 0 && (
            <div className="text-center py-10 text-gray-500">لا توجد طلبات</div>
        )}
      </div>
    </div>
  );
}