
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Order } from '@/lib/types';
import { Loader2, CheckCircle, Clock, Truck, Eye, X, MapPin, Phone, User, Package, XCircle, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, status: status as any });
      }
    } catch (error) {
      alert('فشل تحديث الحالة');
    } finally {
      setStatusUpdating(null);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('تم نسخ الرقم: ' + text);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14} /> تم التوصيل</span>;
      case 'shipped': return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold"><Truck size={14} /> جاري الشحن</span>;
      case 'cancelled': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={14} /> ملغي</span>;
      default: return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14} /> قيد الانتظار</span>;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-emerald-600" size={32} />
    </div>
  );

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
                <th className="px-6 py-4 font-bold text-gray-700">رقم الهاتف</th>
                <th className="px-6 py-4 font-bold text-gray-700">المجموع</th>
                <th className="px-6 py-4 font-bold text-gray-700">الحالة</th>
                <th className="px-6 py-4 font-bold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                // الحصول على الرقم من الطلب أو من حساب المستخدم كخيار بديل
                const displayPhone = order.phone || (typeof order.user === 'object' ? (order.user as any).phone : '');
                
                return (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-gray-500">#{order._id.slice(-6)}</td>
                    <td className="px-6 py-4 font-bold">
                       {typeof order.user === 'object' ? (order.user as any).name : 'مستخدم'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 group">
                        {displayPhone ? (
                          <>
                            <a href={`tel:${displayPhone}`} className="text-sm font-bold text-emerald-600 hover:underline" dir="ltr">
                              {displayPhone}
                            </a>
                            <button onClick={() => copyToClipboard(displayPhone)} className="p-1 text-gray-400 hover:text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Copy size={12} />
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs italic">غير متوفر</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600">${order.totalPrice}</td>
                    <td className="px-6 py-4">
                       {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <Eye size={18} />
                        </button>
                        
                        <div className="relative">
                          <select
                            disabled={statusUpdating === order._id}
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, (e.target as HTMLSelectElement).value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:border-emerald-500 outline-none pr-8 cursor-pointer"
                          >
                            <option value="pending">انتظار</option>
                            <option value="shipped">شحن</option>
                            <option value="delivered">توصيل</option>
                            <option value="cancelled">إلغاء</option>
                          </select>
                          {statusUpdating === order._id && (
                            <div className="absolute left-2 top-1.5 pointer-events-none">
                               <Loader2 size={14} className="animate-spin text-emerald-600" />
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <MotionDiv
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">تفاصيل الطلب #{selectedOrder._id.slice(-6)}</h2>
                  <p className="text-sm text-gray-500 mt-1">التاريخ: {new Date(selectedOrder.createdAt!).toLocaleString('ar-EG')}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 bg-white rounded-full text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Customer Info */}
                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User size={18} className="text-emerald-600" /> بيانات التواصل
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">اسم العميل:</span>
                        <span className="font-bold">{(selectedOrder.user as any)?.name}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-emerald-100">
                        <span className="text-gray-500">رقم الهاتف:</span>
                        <a 
                          href={`tel:${selectedOrder.phone || (selectedOrder.user as any)?.phone}`} 
                          className="font-black text-emerald-700 text-lg" dir="ltr"
                        >
                          {selectedOrder.phone || (selectedOrder.user as any)?.phone || 'غير متوفر'}
                        </a>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">البريد:</span>
                        <span className="font-medium">{(selectedOrder.user as any)?.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin size={18} className="text-blue-600" /> عنوان التوصيل
                    </h3>
                    <div className="space-y-2 text-sm">
                      {selectedOrder.deliveryAddress ? (
                        <>
                          <p className="font-bold text-gray-800">{selectedOrder.deliveryAddress.city}</p>
                          <p className="text-gray-700">{selectedOrder.deliveryAddress.street}</p>
                          {selectedOrder.deliveryAddress.details && (
                             <p className="text-gray-500 bg-white/50 p-2 rounded-lg italic mt-2">
                               {selectedOrder.deliveryAddress.details}
                             </p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 italic">لا يوجد عنوان توصيل محدد</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                   <Package size={18} className="text-emerald-600" /> المنتجات المطلوبة
                </h3>
                <div className="border border-gray-100 rounded-2xl overflow-hidden mb-8">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3">المنتج</th>
                        <th className="px-4 py-3">الكمية</th>
                        <th className="px-4 py-3">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedOrder.items?.map((item: any, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 font-medium text-gray-900">{item.product?.name || 'منتج محذوف'}</td>
                          <td className="px-4 py-3 font-bold text-center">{item.quantity}</td>
                          <td className="px-4 py-3 font-bold text-emerald-600">${item.priceAtTime * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 font-black text-lg">
                       <tr>
                          <td colSpan={2} className="px-4 py-4">الإجمالي النهائي</td>
                          <td className="px-4 py-4 text-emerald-600">${selectedOrder.totalPrice}</td>
                       </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-center pt-4">
                   <button 
                     onClick={() => updateStatus(selectedOrder._id, 'shipped')}
                     disabled={statusUpdating === selectedOrder._id || selectedOrder.status === 'shipped'}
                     className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                   >
                     بدء الشحن
                   </button>
                   <button 
                     onClick={() => updateStatus(selectedOrder._id, 'delivered')}
                     disabled={statusUpdating === selectedOrder._id || selectedOrder.status === 'delivered'}
                     className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                   >
                     تم التوصيل بنجاح
                   </button>
                </div>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
