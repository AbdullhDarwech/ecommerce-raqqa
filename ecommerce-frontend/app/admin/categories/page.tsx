'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, Pencil, Trash2, Save, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subcategories: '', // comma separated
    image: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/admin/categories');
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (error) {
      alert('فشل الحذف');
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingId(category._id);
      setFormData({
        name: category.name,
        description: category.description || '',
        subcategories: category.subcategories ? category.subcategories.join(', ') : '',
        image: null
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', subcategories: '', image: null });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      // Backend expects JSON string for subcategories according to controller
      const subArr = formData.subcategories.split(',').map(s => s.trim()).filter(Boolean);
      data.append('subcategories', JSON.stringify(subArr));
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' }});
      } else {
        await api.post('/admin/categories', data, { headers: { 'Content-Type': 'multipart/form-data' }});
      }
      
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      alert('فشل الحفظ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">الفئات</h1>
        <button 
          onClick={() => openModal()}
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus size={20} /> إضافة فئة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="h-40 bg-gray-50 relative">
               {cat.imageUrl && (
                 <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
               )}
            </div>
            <div className="p-4 flex-1">
               <h3 className="font-bold text-lg text-gray-900">{cat.name}</h3>
               <p className="text-gray-500 text-sm mt-1 line-clamp-2">{cat.description}</p>
               {cat.subcategories && cat.subcategories.length > 0 && (
                 <div className="mt-3 flex flex-wrap gap-1">
                    {cat.subcategories.map(sub => (
                       <span key={sub} className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">{sub}</span>
                    ))}
                 </div>
               )}
            </div>
            <div className="p-4 border-t border-gray-100 flex justify-end gap-2">
               <button onClick={() => openModal(cat)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Pencil size={18} />
               </button>
               <button onClick={() => handleDelete(cat._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold">{editingId ? 'تعديل الفئة' : 'إضافة فئة جديدة'}</h2>
                 <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-500" /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">اسم الفئة</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: (e.target as HTMLInputElement).value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2"
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">الوصف</label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: (e.target as HTMLTextAreaElement).value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">الفئات الفرعية (مفصولة بفاصلة)</label>
                    <input 
                      type="text" 
                      value={formData.subcategories}
                      onChange={(e) => setFormData({...formData, subcategories: (e.target as HTMLInputElement).value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2"
                      placeholder="هواتف, شواحن, سماعات"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">صورة الفئة</label>
                    <input 
                      type="file" 
                      onChange={(e) => setFormData({...formData, image: (e.target as HTMLInputElement).files?.[0] || null})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2"
                      accept="image/*"
                    />
                 </div>
                 
                 <button 
                   type="submit" 
                   disabled={submitting}
                   className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"
                 >
                   {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                   حفظ
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}