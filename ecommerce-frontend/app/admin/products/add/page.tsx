
'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Category, Store } from '@/lib/types';
import { 
  ArrowRight, 
  Plus, 
  Trash2, 
  UploadCloud, 
  Save, 
  Loader2 
} from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: [''],
    category: '',
    brand: '',
    pricePurchase: '',
    priceRental: '',
    stockQuantity: '',
    discountPercentage: '',
    isBestSeller: false,
    images: [] as File[],
    store: ''
  });

  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [catRes, storeRes] = await Promise.all([
          api.get('/admin/categories'),
          api.get('/admin/stores')
        ]);
        setCategories(catRes.data || []);
        setStores(storeRes.data || []);
      } catch (err) {
        console.error("Error loading base data", err);
      }
    };
    fetchBaseData();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDescriptionChange = (value: string, index: number) => {
    const desc = [...formData.description];
    desc[index] = value;
    setFormData(prev => ({ ...prev, description: desc }));
  };

  const addDescriptionLine = () => setFormData(prev => ({ ...prev, description: [...prev.description, ''] }));
  
  const removeDescriptionLine = (index: number) => {
    if (formData.description.length === 1) return;
    const desc = [...formData.description];
    desc.splice(index, 1);
    setFormData(prev => ({ ...prev, description: desc }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...Array.from(e.target.files!)] }));
    }
  };

  const removeImage = (index: number) => {
    const imgs = [...formData.images];
    imgs.splice(index, 1);
    setFormData(prev => ({ ...prev, images: imgs }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.pricePurchase) {
      alert('الرجاء تعبئة كافة الحقول المطلوبة');
      return;
    }
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('brand', formData.brand);
      data.append('pricePurchase', formData.pricePurchase);
      data.append('priceRental', formData.priceRental);
      data.append('stockQuantity', formData.stockQuantity);
      data.append('discountPercentage', formData.discountPercentage);
      data.append('isBestSeller', formData.isBestSeller.toString());
      if (formData.store) data.append('store', formData.store);

      formData.description.forEach((desc) => {
          if (desc.trim()) data.append('description', desc);
      });

      formData.images.forEach((file) => {
        data.append('images', file);
      });

      await api.post('/admin/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.push('/admin/products');
    } catch (error) {
      console.error(error);
      alert('فشل في إضافة المنتج، تأكد من صحة البيانات');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="flex items-center gap-6">
        <Link href="/admin/products" className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-gray-100 shadow-sm">
            <ArrowRight size={24} />
        </Link>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">إضافة منتج جديد</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 space-y-8">
            <h2 className="text-2xl font-black text-gray-800 border-b pb-4">المعلومات الأساسية</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700">اسم المنتج <span className="text-red-500">*</span></label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="مثال: آيفون 15 برو ماكس"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all font-bold" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700">العلامة التجارية</label>
                  <input name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700">الفئة <span className="text-red-500">*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold">
                    <option value="">اختر الفئة</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-black text-gray-700">وصف المنتج (مميزات)</label>
              {formData.description.map((desc, i) => (
                <div key={i} className="flex gap-4">
                  <input
                    value={desc}
                    onChange={(e) => handleDescriptionChange(e.target.value, i)}
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4"
                    placeholder={`النقطة رقم ${i + 1}`}
                  />
                  <button type="button" onClick={() => removeDescriptionLine(i)} className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-100 transition-colors shrink-0">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={addDescriptionLine} className="text-emerald-600 font-black flex items-center gap-2 hover:bg-emerald-50 px-6 py-3 rounded-2xl transition-all w-fit">
                <Plus size={20} /> إضافة سطر جديد
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 space-y-8">
            <h2 className="text-2xl font-black text-gray-800 border-b pb-4">الصور</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {formData.images.map((file, i) => (
                 <div key={i} className="relative aspect-square border-4 border-gray-100 rounded-[2rem] overflow-hidden group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Trash2 size={24} />
                    </button>
                 </div>
              ))}
              <label className="aspect-square border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all text-gray-400 hover:text-emerald-600">
                 <UploadCloud size={40} />
                 <span className="text-xs font-black mt-2">رفع صورة</span>
                 <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-black text-gray-800">التسعير والمخزون</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500">سعر البيع ($)</label>
                <input type="number" name="pricePurchase" value={formData.pricePurchase} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 font-black text-emerald-600" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-500">سعر التأجير ($)</label>
                <input type="number" name="priceRental" value={formData.priceRental} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 font-black text-blue-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500">الكمية</label>
                  <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 font-black" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-500">الخصم (%)</label>
                  <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 font-black text-rose-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-black text-gray-800">المتجر والبائع</h3>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500">اختر المتجر المالك</label>
              <select name="store" value={formData.store} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 font-bold">
                 <option value="">متجر عام</option>
                 {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl cursor-pointer group">
              <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="w-6 h-6 rounded-lg accent-emerald-600" />
              <span className="font-black text-sm text-gray-700 group-hover:text-emerald-600 transition-colors">الأكثر مبيعاً</span>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-emerald-700 shadow-3xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
            حفظ ونشر المنتج
          </button>
        </div>
      </form>
    </div>
  );
}