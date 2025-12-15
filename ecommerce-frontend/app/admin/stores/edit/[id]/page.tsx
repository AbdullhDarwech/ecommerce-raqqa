'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { ArrowRight, Plus, Trash2, Upload, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [store, setStore] = useState({
    name: '',
    description: [''],
    address: '',
    phone: '',
    email: '',
    categories: '',
    logo: null as File | null,
    coverImage: null as File | null,
    currentLogo: '', 
    currentCover: '', 
    isActive: true,
  });

  // 1. Unwrap Params safely using useEffect
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolved = await params;
        if (resolved && resolved.id) {
          setId(resolved.id);
        }
      } catch (e) {
        console.error("Error unwrapping params", e);
      }
    };
    unwrapParams();
  }, [params]);

  // 2. Fetch Store Data
  useEffect(() => {
    if (!id) return;
    
    const fetchStore = async () => {
      try {
        const res = await api.get(`/admin/stores/${id}`);
        const data = res.data;
        setStore({
            name: data.name || '',
            description: data.description && data.description.length > 0 ? data.description : [''],
            address: data.address || '',
            phone: data.phone || '',
            email: data.email || '',
            categories: data.categories ? data.categories.join(', ') : '',
            logo: null,
            coverImage: null,
            currentLogo: data.logo || '',
            currentCover: data.coverImage || '',
            isActive: data.isActive,
        });
      } catch (err) {
        console.error(err);
        alert("فشل تحميل بيانات المتجر");
        router.push('/admin/stores');
      } finally {
        setFetching(false);
      }
    };

    fetchStore();
  }, [id, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const handleDescriptionChange = (value: string, index: number) => {
    const descCopy = [...store.description];
    descCopy[index] = value;
    setStore({ ...store, description: descCopy });
  };

  const addDescriptionLine = () => setStore({ ...store, description: [...store.description, ''] });
  
  const removeDescriptionLine = (index: number) => {
    if (store.description.length === 1) return;
    const descCopy = [...store.description];
    descCopy.splice(index, 1);
    setStore({ ...store, description: descCopy });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'coverImage') => {
    if (e.target.files && e.target.files[0]) {
      setStore({ ...store, [type]: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    if (!store.name.trim()) return alert('اسم المتجر مطلوب');
    
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', store.name);
      formData.append('address', store.address);
      formData.append('phone', store.phone);
      formData.append('email', store.email);
      formData.append('isActive', store.isActive.toString());

      // Append Description
      store.description.forEach((desc) => {
          if(desc.trim()) formData.append('description', desc);
      });

      // Append Categories (Standard, no brackets)
      const cats = store.categories.split(',').map(c => c.trim()).filter(Boolean);
      cats.forEach((cat) => formData.append('categories', cat));

      if (store.logo) formData.append('logo', store.logo);
      if (store.coverImage) formData.append('coverImage', store.coverImage);

      const res = await api.put(`/admin/stores/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 200) {
        router.push('/admin/stores');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تحديث المتجر');
    } finally {
        setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-emerald-600" size={32} />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/stores" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowRight size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">تعديل المتجر: {store.name}</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">اسم المتجر <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="name"
                    value={store.name}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">التصنيفات</label>
                <input
                    type="text"
                    name="categories"
                    value={store.categories}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                    placeholder="إلكترونيات, جوالات, اكسسوارات"
                />
            </div>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">العنوان</label>
                <input
                    type="text"
                    name="address"
                    value={store.address}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">رقم الهاتف</label>
                <input
                    type="text"
                    name="phone"
                    value={store.phone}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                <input
                    type="email"
                    name="email"
                    value={store.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />
            </div>
        </div>

        {/* Dynamic Description */}
        <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">وصف المتجر</label>
            {store.description.map((desc, i) => (
                <div key={i} className="flex gap-2">
                    <input
                        value={desc}
                        onChange={(e) => handleDescriptionChange((e.target as HTMLInputElement).value, i)}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => removeDescriptionLine(i)}
                        className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                        disabled={store.description.length === 1}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={addDescriptionLine}
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
                <Plus size={16} /> إضافة سطر جديد
            </button>
        </div>

        {/* Images Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
             <div className="space-y-2 text-center">
                <label className="block text-sm font-bold text-gray-700 mb-2">شعار المتجر (Logo)</label>
                {store.currentLogo && !store.logo && (
                    <img src={store.currentLogo} alt="current logo" className="w-16 h-16 object-cover mx-auto rounded-lg mb-2" />
                )}
                <label className="cursor-pointer flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-500 transition-all">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">{store.logo ? store.logo.name : 'تغيير الشعار'}</span>
                    <input type="file" onChange={(e) => handleImageChange(e, 'logo')} className="hidden" accept="image/*" />
                </label>
             </div>

             <div className="space-y-2 text-center">
                <label className="block text-sm font-bold text-gray-700 mb-2">صورة الغلاف (Cover)</label>
                {store.currentCover && !store.coverImage && (
                    <img src={store.currentCover} alt="current cover" className="w-full h-16 object-cover mx-auto rounded-lg mb-2" />
                )}
                <label className="cursor-pointer flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-500 transition-all">
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">{store.coverImage ? store.coverImage.name : 'تغيير صورة الغلاف'}</span>
                    <input type="file" onChange={(e) => handleImageChange(e, 'coverImage')} className="hidden" accept="image/*" />
                </label>
             </div>
        </div>

        {/* Activation */}
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl text-blue-800">
            <input
              type="checkbox"
              id="isActive"
              checked={store.isActive}
              onChange={(e) => setStore({...store, isActive: (e.target as HTMLInputElement).checked})}
              className="w-5 h-5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="isActive" className="font-bold cursor-pointer">المتجر مفعل</label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          حفظ التعديلات
        </button>
      </div>
    </div>
  );
}