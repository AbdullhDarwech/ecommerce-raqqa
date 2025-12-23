'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { Category, Store } from '@/lib/types';
import { ArrowRight, Plus, Trash2, Upload, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  return `${API_BASE}${url}`;
};

export default function EditProductPage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = routeParams.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    newImages: [] as File[],
    existingImages: [] as string[],
    deletedImages: [] as string[],
    store: ''
  });

  useEffect(() => {
    if (!id) return;

    const init = async () => {
       try {
          const [catRes, storeRes, productRes] = await Promise.all([
             api.get('/admin/categories'),
             api.get('/admin/stores'),
             api.get(`/admin/products/${id}`).catch(() => api.get(`/products/${id}`))
          ]);

          setCategories(catRes.data);
          setStores(storeRes.data);
          
          const p = productRes.data;
          setFormData({
            name: p.name || '',
            description: p.description && p.description.length > 0 ? p.description : [''],
            category: typeof p.category === 'object' && p.category ? p.category._id : (p.category || ''),
            subcategory: p.subcategory || '',
            brand: p.brand || '',
            pricePurchase: p.pricePurchase || '',
            priceRental: p.priceRental || '',
            stockQuantity: p.stockQuantity || '',
            discountPercentage: p.discountPercentage || '',
            isBestSeller: !!p.isBestSeller,
            newImages: [],
            existingImages: p.images || [],
            deletedImages: [],
            store: p.store ? (typeof p.store === 'object' ? p.store._id : p.store) : ''
          });
       } catch(e) {
         setError("خطأ في تحميل بيانات المنتج");
       } finally {
         setFetching(false);
       }
    };
    init();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
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
    if (formData.description.length === 1) {
        setFormData(prev => ({ ...prev, description: [''] }));
        return;
    }
    const desc = [...formData.description];
    desc.splice(index, 1);
    setFormData(prev => ({ ...prev, description: desc }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, newImages: [...prev.newImages, ...Array.from(e.target.files!)] }));
    }
  };

  const removeNewImage = (index: number) => {
    const imgs = [...formData.newImages];
    imgs.splice(index, 1);
    setFormData(prev => ({ ...prev, newImages: imgs }));
  };

  const markImageForDeletion = (url: string) => {
    setFormData(prev => ({
       ...prev,
       existingImages: prev.existingImages.filter(img => img !== url),
       deletedImages: [...prev.deletedImages, url]
    }));
  };

  const handleSubmit = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('subcategory', formData.subcategory);
      data.append('brand', formData.brand);
      data.append('pricePurchase', formData.pricePurchase.toString());
      data.append('priceRental', formData.priceRental.toString());
      data.append('stockQuantity', formData.stockQuantity.toString());
      data.append('discountPercentage', formData.discountPercentage.toString());
      data.append('isBestSeller', formData.isBestSeller.toString());
      if(formData.store) data.append('store', formData.store);

      formData.description.forEach((desc) => {
          if(desc.trim()) data.append('description', desc);
      });

      if (formData.deletedImages.length > 0) {
        data.append('deletedImages', JSON.stringify(formData.deletedImages));
      }

      formData.newImages.forEach((file) => {
        data.append('images', file);
      });

      const response = await api.put(`/admin/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
         setSuccess(true);
         setTimeout(() => {
           router.push('/admin/products');
           router.refresh(); // إجبار Next.js على تحديث الكاش
         }, 1000);
      } else {
         throw new Error("فشل التحديث في الخادم");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'فشل تحديث المنتج. تأكد من صحة البيانات.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <ArrowRight size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">تعديل المنتج</h1>
      </div>

      {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100 animate-shake">
              <AlertCircle size={20} />
              <p className="font-bold">{error}</p>
          </div>
      )}

      {success && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
              <CheckCircle size={20} />
              <p className="font-bold">تم تحديث المنتج بنجاح! جاري العودة...</p>
          </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">اسم المنتج</label>
              <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الفئة</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors">
                 <option value="">اختر الفئة</option>
                 {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الفئة الفرعية</label>
              <input name="subcategory" value={formData.subcategory} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">العلامة التجارية</label>
              <input name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">المتجر</label>
              <select name="store" value={formData.store} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors">
                 <option value="">اختر المتجر</option>
                 {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">سعر الشراء</label>
              <input type="number" name="pricePurchase" value={formData.pricePurchase} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">سعر التأجير</label>
              <input type="number" name="priceRental" value={formData.priceRental} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الكمية</label>
              <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">الخصم (%)</label>
              <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors" />
           </div>
        </div>

        <div className="space-y-3">
            <label className="text-sm font-bold text-gray-700">الوصف (نقاط)</label>
            {formData.description.map((desc, i) => (
                <div key={i} className="flex gap-2">
                    <input
                        value={desc}
                        onChange={(e) => handleDescriptionChange((e.target as HTMLInputElement).value, i)}
                        className="flex-1 bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="أدخل نقطة وصف..."
                    />
                    <button type="button" onClick={() => removeDescriptionLine(i)} className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                        <Trash2 size={20} />
                    </button>
                </div>
            ))}
            <button type="button" onClick={addDescriptionLine} className="text-sm font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-700 transition-colors">
                <Plus size={16} /> إضافة سطر
            </button>
        </div>

        <div className="space-y-4">
           <label className="block text-sm font-bold text-gray-700">الصور الحالية</label>
           <div className="flex flex-wrap gap-4">
              {formData.existingImages.map((img, i) => (
                 <div key={i} className="relative w-24 h-24 border rounded-xl overflow-hidden group bg-gray-100">
                    <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="product" />
                    <button onClick={() => markImageForDeletion(img)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Trash2 size={20} />
                    </button>
                 </div>
              ))}
           </div>

           <label className="block text-sm font-bold text-gray-700 mt-4">إضافة صور جديدة</label>
           <div className="flex flex-wrap gap-4">
              {formData.newImages.map((file, i) => (
                 <div key={i} className="relative w-24 h-24 border rounded-xl overflow-hidden group">
                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                    <button onClick={() => removeNewImage(i)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Trash2 size={20} />
                    </button>
                 </div>
              ))}
              <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                 <Upload size={24} className="text-gray-400" />
                 <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
              </label>
           </div>
        </div>

        <div className="flex items-center gap-3">
            <input 
                type="checkbox" 
                id="isBestSeller" 
                name="isBestSeller" 
                checked={formData.isBestSeller} 
                onChange={handleChange} 
                className="w-5 h-5 rounded cursor-pointer accent-emerald-600" 
            />
            <label htmlFor="isBestSeller" className="font-bold cursor-pointer text-gray-700">الأكثر مبيعاً</label>
        </div>

        <button 
            onClick={handleSubmit} 
            disabled={loading} 
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          حفظ التعديلات
        </button>
      </div>
    </div>
  );
}