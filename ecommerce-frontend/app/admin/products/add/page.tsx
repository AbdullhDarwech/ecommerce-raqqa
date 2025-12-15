'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Category, Store } from '@/lib/types';
import { ArrowRight, Plus, Trash2, CloudUpload, Save, Loader2 } from 'lucide-react';
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
    subcategory: '',
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
    // Fetch Categories & Stores for dropdowns
    api.get('/admin/categories').then(res => setCategories(res.data)).catch(console.error);
    api.get('/admin/stores').then(res => setStores(res.data)).catch(console.error);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDescriptionChange = (value: string, index: number) => {
    const desc = [...formData.description];
    desc[index] = value;
    setFormData({ ...formData, description: desc });
  };

  const addDescriptionLine = () => setFormData({ ...formData, description: [...formData.description, ''] });
  const removeDescriptionLine = (index: number) => {
    if (formData.description.length === 1) return;
    const desc = [...formData.description];
    desc.splice(index, 1);
    setFormData({ ...formData, description: desc });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, images: [...formData.images, ...Array.from(e.target.files)] });
    }
  };

  const removeImage = (index: number) => {
    const imgs = [...formData.images];
    imgs.splice(index, 1);
    setFormData({ ...formData, images: imgs });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.pricePurchase) {
      alert('الرجاء تعبئة الحقول الأساسية');
      return;
    }
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('subcategory', formData.subcategory);
      data.append('brand', formData.brand);
      data.append('pricePurchase', formData.pricePurchase);
      data.append('priceRental', formData.priceRental);
      data.append('stockQuantity', formData.stockQuantity);
      data.append('discountPercentage', formData.discountPercentage);
      data.append('isBestSeller', formData.isBestSeller.toString());
      if(formData.store) data.append('store', formData.store);

      formData.description.forEach((desc, i) => {
          if(desc) data.append(`description[${i}]`, desc);
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
      alert('فشل إنشاء المنتج');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <ArrowRight size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">إضافة منتج جديد</h1>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">اسم المنتج <span className="text-red-500">*</span></label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">العلامة التجارية</label>
              <input name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الفئة <span className="text-red-500">*</span></label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3">
                 <option value="">اختر الفئة</option>
                 {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الفئة الفرعية</label>
              <input name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">المتجر (اختياري)</label>
              <select name="store" value={formData.store} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3">
                 <option value="">اختر المتجر</option>
                 {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
           </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">سعر الشراء</label>
              <input type="number" name="pricePurchase" value={formData.pricePurchase} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">سعر التأجير (اختياري)</label>
              <input type="number" name="priceRental" value={formData.priceRental} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الكمية</label>
              <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الخصم (%)</label>
              <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3" />
           </div>
        </div>

        {/* Description */}
        <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">الوصف (نقاط)</label>
            {formData.description.map((desc, i) => (
                <div key={i} className="flex gap-2">
                    <input
                        value={desc}
                        onChange={(e) => handleDescriptionChange(e.target.value, i)}
                        className="flex-1 bg-gray-50 border rounded-xl px-4 py-3"
                    />
                    <button type="button" onClick={() => removeDescriptionLine(i)} className="p-3 text-red-500 bg-red-50 rounded-xl">
                        <Trash2 size={20} />
                    </button>
                </div>
            ))}
            <button type="button" onClick={addDescriptionLine} className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                <Plus size={16} /> إضافة سطر
            </button>
        </div>

        {/* Images */}
        <div className="space-y-4">
           <label className="block text-sm font-bold text-gray-700">صور المنتج</label>
           <div className="flex flex-wrap gap-4">
              {formData.images.map((file, i) => (
                 <div key={i} className="relative w-24 h-24 border rounded-xl overflow-hidden group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <button onClick={() => removeImage(i)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Trash2 size={20} />
                    </button>
                 </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition-colors">
                 <CloudUpload size={24} className="text-gray-400" />
                 <span className="text-xs text-gray-500 mt-1">رفع</span>
                 <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
           </div>
        </div>

        <div className="flex items-center gap-3">
            <input type="checkbox" id="isBestSeller" name="isBestSeller" checked={formData.isBestSeller} onChange={(e) => setFormData({...formData, isBestSeller: e.target.checked})} className="w-5 h-5 rounded" />
            <label htmlFor="isBestSeller" className="font-bold cursor-pointer">الأكثر مبيعاً</label>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          حفظ المنتج
        </button>
      </div>
    </div>
  );
}