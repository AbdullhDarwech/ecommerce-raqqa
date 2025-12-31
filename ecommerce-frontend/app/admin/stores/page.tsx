
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Trash2, Pencil, Plus, Store as StoreIcon, 
  Phone, Search, Loader2, Check, X, ExternalLink, Eye 
} from 'lucide-react';
import api from '@/lib/api';
import { Store } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const MotionTr = motion.tr as any;

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/stores');
      setStores(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
        router.push('/');
        return;
    }
    fetchStores();
  }, [user, router]);

  const handleDelete = async (id: string) => {
    if(!confirm("هل أنت متأكد من حذف هذا المتجر نهائياً؟")) return;
    try {
        await api.delete(`/admin/stores/${id}`);
        setStores(stores.filter((s) => s._id !== id));
    } catch (err) {
        alert("فشل الحذف، يرجى المحاولة لاحقاً");
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">إدارة المتاجر</h1>
            <p className="text-gray-500 mt-2 font-medium flex items-center gap-2">
              <StoreIcon size={18} className="text-emerald-500" />
              قائمة الشركاء والبائعين في سوق الرقة
            </p>
        </div>
        <Link
          href="/admin/stores/add"
          className="flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-[2.5rem] font-black hover:bg-emerald-700 transition-all shadow-3xl shadow-emerald-500/20"
        >
          <Plus size={22} /> إضافة متجر جديد
        </Link>
      </div>

      <div className="bg-white p-4 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <input 
            type="text" 
            placeholder="ابحث عن متجر بالاسم..." 
            className="w-full pl-6 pr-16 py-5 bg-gray-50 border-none rounded-[1.8rem] focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-black text-gray-800 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-10 py-7 font-black text-gray-400 text-xs uppercase tracking-[0.2em] text-right">المتجر</th>
                <th className="px-10 py-7 font-black text-gray-400 text-xs uppercase tracking-[0.2em] text-right">الحالة</th>
                <th className="px-10 py-7 font-black text-gray-400 text-xs uppercase tracking-[0.2em] text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode='popLayout'>
                {filteredStores.map((store) => (
                  <MotionTr key={store._id} layout className="hover:bg-emerald-50/30 transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border-2 border-white shadow-sm shrink-0 flex items-center justify-center">
                          {store.logo ? (
                            <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-emerald-600 font-black text-xl">{store.name[0]}</span>
                          )}
                        </div>
                        <Link href={`/admin/stores/${store._id}`} className="font-black text-gray-900 text-lg hover:text-emerald-600 transition-colors">
                          {store.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      {store.isActive ? (
                          <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full text-xs font-black border border-emerald-200">
                              <Check size={14} /> نشط الآن
                          </span>
                      ) : (
                          <span className="inline-flex items-center gap-2 bg-rose-50 text-rose-700 px-5 py-2 rounded-full text-xs font-black border border-rose-100">
                              <X size={14} /> متوقف مؤقتاً
                          </span>
                      )}
                    </td>
                    <td className="px-10 py-7 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/admin/stores/${store._id}`} className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all" title="عرض التفاصيل"><Eye size={22} /></Link>
                        <Link href={`/admin/stores/edit/${store._id}`} className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all" title="تعديل"><Pencil size={22} /></Link>
                        <button onClick={() => handleDelete(store._id)} className="p-3 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all" title="حذف"><Trash2 size={22} /></button>
                      </div>
                    </td>
                  </MotionTr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
