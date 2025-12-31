'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Package, MapPin, Settings, LogOut, 
  Camera, Mail, Phone, Calendar, ChevronLeft, 
  Loader2, Save, ShoppingBag, Plus, Trash2, Edit2, Clock, CheckCircle, Truck, XCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/api';
import { Order } from '@/lib/types';
import Image from 'next/image';

const MotionDiv = motion.div as any;

export default function ProfilePage() {
  const { user, loading, logout, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'addresses' | 'settings'>('dashboard');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab user={user} />;
      case 'orders': return <OrdersTab />;
      case 'addresses': return <AddressesTab user={user} />;
      case 'settings': return <SettingsTab user={user} onUpdate={updateUser} />;
      default: return <DashboardTab user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-28">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold border-4 border-white shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-md">
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="mt-2 bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-bold">
                    مسؤول النظام
                  </span>
                )}
              </div>

              <nav className="space-y-2">
                <SidebarItem 
                  icon={<User size={20} />} 
                  label="نظرة عامة" 
                  active={activeTab === 'dashboard'} 
                  onClick={() => setActiveTab('dashboard')} 
                />
                <SidebarItem 
                  icon={<Package size={20} />} 
                  label="طلباتي" 
                  active={activeTab === 'orders'} 
                  onClick={() => setActiveTab('orders')} 
                />
                <SidebarItem 
                  icon={<MapPin size={20} />} 
                  label="العناوين" 
                  active={activeTab === 'addresses'} 
                  onClick={() => setActiveTab('addresses')} 
                />
                <SidebarItem 
                  icon={<Settings size={20} />} 
                  label="الإعدادات" 
                  active={activeTab === 'settings'} 
                  onClick={() => setActiveTab('settings')} 
                />
                <div className="h-px bg-gray-100 my-4" />
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <LogOut size={20} />
                  تسجيل الخروج
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <AnimatePresence mode="wait">
              <MotionDiv
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </MotionDiv>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Sub-Components & Tabs
// ----------------------------------------------------------------------

function SidebarItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
        active 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {active && <ChevronLeft size={16} />}
    </button>
  );
}

function DashboardTab({ user }: { user: any }) {
  const [ordersCount, setOrdersCount] = useState<number | string>('-');

  useEffect(() => {
    api.get('/orders')
      .then(res => {
        if (Array.isArray(res.data)) {
          setOrdersCount(res.data.length);
        } else {
          setOrdersCount(0);
        }
      })
      .catch(err => {
        console.error("Failed to fetch order count", err);
        setOrdersCount(0);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<ShoppingBag />} label="إجمالي الطلبات" value={ordersCount} color="bg-blue-500" />
        <StatCard icon={<MapPin />} label="العناوين المحفوظة" value={user.addresses?.length || 0} color="bg-orange-500" />
        <StatCard icon={<User />} label="تاريخ الانضمام" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : new Date().toLocaleDateString('ar-EG')} color="bg-emerald-500" />
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">المعلومات الشخصية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
          <InfoItem icon={<User size={18} />} label="الاسم الكامل" value={user.name} />
          <InfoItem icon={<Mail size={18} />} label="البريد الإلكتروني" value={user.email} />
          <InfoItem icon={<Phone size={18} />} label="رقم الهاتف" value={user.phone || 'غير محدد'} />
          <InfoItem icon={<Calendar size={18} />} label="تاريخ التسجيل" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-EG') : "غير محدد"} />
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // UPDATED: Use '/orders' which now handles filtering by user on backend
    api.get('/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err)) 
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered': return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={14} /> تم التوصيل</span>;
      case 'shipped': return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold"><Truck size={14} /> جاري الشحن</span>;
      case 'cancelled': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold"><XCircle size={14} /> ملغي</span>;
      default: return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold"><Clock size={14} /> قيد الانتظار</span>;
    }
  };

  if (loading) return <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-emerald-600" /></div>;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">طلباتي السابقة</h3>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-100 rounded-2xl p-5 hover:border-emerald-500 transition-all group">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b border-gray-50 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">طلب #{order._id.slice(-6)}</span>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : ''}</p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">الإجمالي</p>
                  <p className="font-bold text-emerald-600 text-lg">${order.totalPrice}</p>
                </div>
              </div>
              
              {/* Detailed Item List */}
              <div className="space-y-3">
                 {order.items && order.items.length > 0 ? (
                   order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                       <div className="w-14 h-14 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
                          {item.product?.images?.[0] ? (
                             <img 
                               src={item.product.images[0]} 
                               alt={item.product.name} 
                               className="w-full h-full object-cover" 
                             />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                               <Package size={20} />
                             </div>
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{item.product?.name || 'منتج محذوف'}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                             <span className="bg-white px-2 py-0.5 rounded border border-gray-200">الكمية: {item.quantity}</span>
                             <span className="font-bold text-emerald-600">${item.priceAtTime}</span>
                             {item.orderType === 'rental' && (
                               <span className="text-blue-600 bg-blue-50 px-1.5 rounded">إيجار</span>
                             )}
                          </div>
                       </div>
                    </div>
                   ))
                 ) : (
                   <p className="text-gray-400 text-sm">لا توجد تفاصيل للمنتجات</p>
                 )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">لا توجد طلبات بعد</h3>
          <p className="text-gray-500 mt-2">لم تقم بإجراء أي طلب حتى الآن.</p>
        </div>
      )}
    </div>
  );
}

function AddressesTab({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">دفتر العناوين</h3>
          <button className="flex items-center gap-2 text-emerald-600 font-bold text-sm hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={16} /> إضافة عنوان
          </button>
        </div>
        
        {user.addresses && user.addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr: any, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-xl hover:border-emerald-500 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900">{addr.city}</h4>
                  <div className="flex gap-2">
                    <button className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit2 size={14} /></button>
                    <button className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 size={14} /></button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{addr.street}</p>
                <p className="text-sm text-gray-500 mt-1">{addr.details}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <MapPin size={32} className="mx-auto mb-2 opacity-50" />
            <p>لا توجد عناوين محفوظة</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab({ user, onUpdate }: { user: any; onUpdate: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    phone: user.phone || '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate update or call API
    try {
      await new Promise(r => setTimeout(r, 1000));
      onUpdate({ name: formData.name, phone: formData.phone });
      alert("تم تحديث البيانات بنجاح");
    } catch (e) {
      alert("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">إعدادات الحساب</h3>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
          <input 
            type="text" 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold text-gray-900 mb-4">تغيير كلمة المرور</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور الجديدة</label>
              <input 
                type="password" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">تأكيد كلمة المرور</label>
              <input 
                type="password" 
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          حفظ التغييرات
        </button>
      </form>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  );
}