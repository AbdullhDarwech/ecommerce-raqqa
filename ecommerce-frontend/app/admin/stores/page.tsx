'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2, Pencil, Plus, MapPin, Store as StoreIcon, Phone, Search, Filter, Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';
import { Store } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check admin role
    if (user && user.role !== 'admin') {
        router.push('/');
        return;
    }

    api.get('/admin/stores').then((res) => {
      setStores(res.data);
      setLoading(false);
    }).catch(err => {
        console.error(err);
        setLoading(false);
    });
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if(!confirm("هل أنت متأكد من حذف هذا المتجر؟")) return;
    
    try {
        await api.delete(`/admin/stores/${id}`);
        setStores(stores.filter((p) => p._id !== id));
    } catch (err) {
        alert("فشل الحذف");
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.phone?.includes(searchTerm) ||
    store.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
      <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">إدارة المتاجر</h1>
            <p className="text-gray-500 mt-1">عرض وإدارة متاجر البائعين</p>
        </div>

        <Link
          href="/admin/stores/add"
          className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20"
        >
          <Plus size={20} /> إضافة متجر جديد
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="بحث باسم المتجر، الهاتف، أو البريد..." 
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
          />
        </div>
        <button className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
           <Filter size={20} />
        </button>
      </div>

      {/* Stores Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">المتجر</th>
                <th className="px-6 py-4 font-bold text-gray-700">معلومات الاتصال</th>
                <th className="px-6 py-4 font-bold text-gray-700">التصنيف</th>
                <th className="px-6 py-4 font-bold text-gray-700">الحالة</th>
                <th className="px-6 py-4 font-bold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStores.map((store) => (
                <tr key={store._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative">
                        {store.logo ? (
                           <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                             {store.name.charAt(0)}
                           </div>
                        )}
                      </div>
                      <div>
                        <span className="block font-bold text-gray-900">{store.name}</span>
                        <span className="text-xs text-gray-500">{store.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 space-y-1">
                    {store.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone size={14} className="text-gray-400" />
                            <span dir="ltr">{store.phone}</span>
                        </div>
                    )}
                    {store.address && (
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-gray-400" />
                            <span className="truncate max-w-[150px]" title={store.address}>{store.address}</span>
                        </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                        {store.categories?.[0] || 'عام'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {store.isActive ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <CheckCircle size={14} /> مفعل
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2.5 py-1 rounded-full text-xs font-bold">
                            <XCircle size={14} /> غير مفعل
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/stores/edit/${store._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="تعديل"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(store._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStores.length === 0 && (
            <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-2">
                <StoreIcon size={32} className="text-gray-300" />
                <p>لا توجد متاجر مطابقة</p>
            </div>
        )}
      </div>
    </div>
  );
}