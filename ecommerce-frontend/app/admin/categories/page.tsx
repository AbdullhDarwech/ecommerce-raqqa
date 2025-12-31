
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Pencil, Trash2, Save, X, Loader2, 
  ImageIcon, Layers, Search, AlertCircle, CheckCircle, Upload, Tags
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Category } from '@/lib/types';

const MotionDiv = motion.div as any;

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return `${API_BASE}${url}`;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subcategories: '',
    attributeConfig: '', 
    image: null as File | null
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const showMsg = (text: string, type: 'success' | 'error' = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    
    const subs = formData.subcategories.split(',').map(s => s.trim()).filter(Boolean);
    data.append('subcategories', JSON.stringify(subs));

    const attrs = formData.attributeConfig.split(',').map(s => s.trim()).filter(Boolean);
    data.append('attributeConfig', JSON.stringify(attrs));
    
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMsg('تم تحديث الفئة بنجاح');
      } else {
        await api.post('/admin/categories', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showMsg('تمت إضافة الفئة بنجاح');
      }
      setIsModalOpen(false);
      fetchCategories();
      setPreviewUrl(null);
    } catch (e: any) {
      showMsg(e.response?.data?.error || 'حدث خطأ أثناء العملية', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (cat?: Category) => {
    if (cat) {
      setEditingId(cat._id);
      setFormData({
        name: cat.name,
        description: cat.description || '',
        subcategories: cat.subcategories?.join(', ') || '',
        attributeConfig: cat.attributeConfig?.join(', ') || '',
        image: null
      });
      setPreviewUrl(cat.imageUrl ? getImageUrl(cat.imageUrl) : null);
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', subcategories: '', attributeConfig: '', image: null });
      setPreviewUrl(null);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('سيتم حذف الفئة نهائياً، هل أنت متأكد؟')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      showMsg('تم الحذف بنجاح');
    } catch (e) { showMsg('فشل حذف الفئة', 'error'); }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-600" size={40} /></div>;

  return (
    <div className="space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-900">إدارة الفئات</h1>
        <button onClick={() => openModal()} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20">
          <Plus size={20} /> إضافة فئة جديدة
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" placeholder="بحث عن فئة..." 
          className="w-full pr-12 pl-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.filter(c => c.name.includes(searchTerm)).map(cat => (
          <MotionDiv key={cat._id} layout className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="h-48 bg-gray-50 relative overflow-hidden">
              {cat.imageUrl ? (
                <img 
                  src={getImageUrl(cat.imageUrl)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={cat.name}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100"><ImageIcon size={48} /></div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2 text-gray-900">{cat.name}</h3>
              <div className="flex flex-wrap gap-1 mb-4">
                 {cat.attributeConfig?.map(attr => (
                   <span key={attr} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">{attr}</span>
                 ))}
              </div>
              <p className="text-gray-500 text-sm line-clamp-2 mb-6 min-h-[40px]">{cat.description || 'لا يوجد وصف'}</p>
              <div className="flex justify-end gap-2 border-t pt-4">
                <button onClick={() => openModal(cat)} className="p-2.5 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"><Pencil size={18} /></button>
                <button onClick={() => handleDelete(cat._id)} className="p-2.5 text-rose-600 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"><Trash2 size={18} /></button>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <MotionDiv 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900">{editingId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">اسم الفئة *</label>
                  <input 
                    type="text" placeholder="مثلاً: إلكترونيات" required 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/10 font-bold"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-400 uppercase flex items-center gap-2 px-2">
                    <Tags size={14} /> الخصائص المطلوبة (مثال: اللون, المقاس, الموديل)
                  </label>
                  <input 
                    type="text" placeholder="افصل بينها بفاصلة" 
                    className="w-full px-5 py-4 bg-slate-900 text-white rounded-2xl outline-none placeholder:text-slate-600"
                    value={formData.attributeConfig} onChange={e => setFormData({...formData, attributeConfig: e.target.value})}
                  />
                  <p className="text-[10px] text-gray-400 pr-2 italic">تظهر هذه الحقول عند إضافة منتج لهذه الفئة.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">الوصف</label>
                  <textarea 
                    placeholder="اكتب وصفاً قصيراً للفئة..." 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/10 h-28 font-medium resize-none"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">أقسام فرعية</label>
                  <input 
                    type="text" placeholder="مثلاً: هواتف, لابتوبات" 
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/10 font-medium"
                    value={formData.subcategories} onChange={e => setFormData({...formData, subcategories: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">صورة الفئة</label>
                  <div className="border-4 border-dashed border-gray-100 rounded-[2rem] p-6 text-center hover:border-emerald-500 hover:bg-emerald-50 transition-all group relative overflow-hidden min-h-[200px] flex flex-col items-center justify-center">
                    <input type="file" onChange={handleFileChange} className="hidden" id="file-up" accept="image/*" />
                    <label htmlFor="file-up" className="cursor-pointer text-gray-500 flex flex-col items-center w-full">
                      {previewUrl ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner">
                           <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="text-white" size={32} />
                           </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                             <ImageIcon size={32} className="text-emerald-500" />
                          </div>
                          <span className="font-bold text-gray-600">اضغط لرفع صورة الفئة</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 disabled:opacity-50 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3"
                >
                  {submitting ? <Loader2 className="animate-spin" size={24} /> : editingId ? 'تحديث البيانات' : 'إضافة الفئة الآن'}
                </button>
              </form>
            </MotionDiv>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {msg && (
          <MotionDiv 
            initial={{ y: 50, opacity: 0, x: '-50%' }} 
            animate={{ y: 0, opacity: 1, x: '-50%' }} 
            exit={{ y: 50, opacity: 0, x: '-50%' }} 
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-bold z-[200] ${msg.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}
          >
            {msg.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            {msg.text}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}