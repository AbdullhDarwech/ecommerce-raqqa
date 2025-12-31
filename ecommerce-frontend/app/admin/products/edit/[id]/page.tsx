
'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Category, Store, ProductProperty } from '@/lib/types';
import { 
  ArrowRight, Plus, Trash2, UploadCloud, Save, 
  Loader2, Info, Settings2, Sparkles, X, ListPlus, 
  Image as ImageIcon, DollarSign
} from 'lucide-react';
import Link from 'next/link';

const MotionDiv = motion.div as any;

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: [''],
    properties: [{ key: '', value: '' }] as ProductProperty[],
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

  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/admin/categories'),
          api.get(`/admin/products/${id}`)
        ]);
        
        setCategories(catRes.data || []);
        const p = prodRes.data;

        setFormData({
          name: p.name || '',
          description: p.description && p.description.length > 0 ? p.description : [''],
          properties: p.properties && p.properties.length > 0 ? p.properties : [{ key: '', value: '' }],
          category: typeof p.category === 'object' ? p.category._id : p.category,
          subcategory: p.subcategory || '',
          brand: p.brand || '',
          pricePurchase: p.pricePurchase || '',
          priceRental: p.priceRental || '',
          stockQuantity: p.stockQuantity || '0',
          discountPercentage: p.discountPercentage || '0',
          isBestSeller: !!p.isBestSeller,
          newImages: [],
          existingImages: p.images || [],
          deletedImages: [],
          store: p.store ? (typeof p.store === 'object' ? p.store._id : p.store) : ''
        });
      } catch (err) {
        console.error("Initialization error", err);
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

  const handlePropertyChange = (index: number, field: 'key' | 'value', value: string) => {
    const props = [...formData.properties];
    props[index][field] = value;
    setFormData(prev => ({ ...prev, properties: props }));
  };
  const addProperty = () => setFormData(prev => ({ ...prev, properties: [...prev.properties, { key: '', value: '' }] }));
  const removeProperty = (index: number) => {
    const props = [...formData.properties];
    props.splice(index, 1);
    setFormData(prev => ({ ...prev, properties: props.length > 0 ? props : [{ key: '', value: '' }] }));
  };

  const handleDescriptionChange = (value: string, index: number) => {
    const desc = [...formData.description];
    desc[index] = value;
    setFormData(prev => ({ ...prev, description: desc }));
  };
  const addDesc = () => setFormData(prev => ({ ...prev, description: [...prev.description, ''] }));
  const removeDesc = (index: number) => {
    const desc = [...formData.description];
    desc.splice(index, 1);
    setFormData(prev => ({ ...prev, description: desc.length > 0 ? desc : [''] }));
  };

  const handleNewImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      setFormData(prev => ({ ...prev, newImages: [...prev.newImages, ...files] }));
      const urls = files.map(f => URL.createObjectURL(f));
      setNewPreviews(prev => [...prev, ...urls]);
    }
  };

  const removeExisting = (url: string) => {
    setFormData(prev => ({
      ...prev,
      existingImages: prev.existingImages.filter(img => img !== url),
      deletedImages: [...prev.deletedImages, url]
    }));
  };

  const removeNew = (index: number) => {
    setFormData(prev => ({ ...prev, newImages: prev.newImages.filter((_, i) => i !== index) }));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category || !formData.pricePurchase) {
        alert("يرجى إكمال البيانات الأساسية");
        return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category', formData.category);
      data.append('subcategory', formData.subcategory);
      data.append('brand', formData.brand);
      data.append('pricePurchase', formData.pricePurchase.toString());
      data.append('priceRental', (formData.priceRental || '0').toString());
      data.append('stockQuantity', (formData.stockQuantity || '0').toString());
      data.append('isBestSeller', formData.isBestSeller.toString());
      
      formData.description.forEach(d => { 
        if(d.trim()) data.append('description', d); 
      });

      const validProps = formData.properties.filter(p => p.key.trim() && p.value.trim());
      data.append('properties', JSON.stringify(validProps));

      if (formData.deletedImages.length > 0) {
        data.append('deletedImages', JSON.stringify(formData.deletedImages));
      }

      formData.newImages.forEach(file => data.append('images', file));

      const response = await api.put(`/admin/products/${id}`, data, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });

      if (response.status === 200) {
        router.push('/admin/products');
      }
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || 'فشل التحديث، يرجى مراجعة البيانات والاتصال');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-600" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/admin/products" className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all border border-slate-100 shadow-sm">
            <ArrowRight size={24} />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">تعديل المقتنى</h1>
            <p className="text-slate-400 font-medium">تحديث بيانات المنتج في معرض فوراتو</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="bg-emerald-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-emerald-700 shadow-2xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
          حفظ التغييرات
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Info size={24} /></div>
              <h2 className="text-2xl font-black text-slate-900">المعلومات الأساسية</h2>
            </div>
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 mr-4">اسم المقتنى</label>
                <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl px-8 py-5 font-bold text-lg outline-none focus:border-emerald-500/20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 mr-4">الفئة</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl px-8 py-5 font-bold outline-none">
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 mr-4">العلامة التجارية</label>
                   <input name="brand" value={formData.brand} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl px-8 py-5 font-bold outline-none" />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 space-y-8">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4"><Settings2 /> الخصائص التقنية</h2>
               <button onClick={addProperty} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Plus size={18}/></button>
            </div>
            <div className="space-y-4">
                {formData.properties.map((p, idx) => (
                <div key={idx} className="flex gap-4">
                    <input placeholder="المفتاح" value={p.key} onChange={e => handlePropertyChange(idx, 'key', e.target.value)} className="flex-1 bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus:border-emerald-500/20 outline-none" />
                    <input placeholder="القيمة" value={p.value} onChange={e => handlePropertyChange(idx, 'value', e.target.value)} className="flex-1 bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus:border-emerald-500/20 outline-none" />
                    <button onClick={() => removeProperty(idx)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl"><Trash2 size={20}/></button>
                </div>
                ))}
            </div>
          </section>

          <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50 space-y-8">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4"><ListPlus /> نقاط الوصف</h2>
               <button onClick={addDesc} className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Plus size={18}/></button>
            </div>
            <div className="space-y-4">
                {formData.description.map((d, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                    <input value={d} onChange={e => handleDescriptionChange(e.target.value, idx)} className="flex-1 bg-slate-50 rounded-xl px-4 py-3 border border-transparent focus:border-emerald-500/20 outline-none" />
                    <button onClick={() => removeDesc(idx)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl"><X size={18}/></button>
                </div>
                ))}
            </div>
          </section>
        </div>

        <div className="space-y-12">
          <section className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 space-y-6">
            <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-widest text-sm"><DollarSign size={20}/> التسعير والمخزون</h3>
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 mr-2 uppercase">سعر البيع ($)</label>
                    <input type="number" name="pricePurchase" value={formData.pricePurchase} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-black text-emerald-600 text-xl outline-none" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 mr-2 uppercase">الكمية</label>
                    <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold outline-none" />
                </div>
                <div className="pt-4 border-t border-slate-50">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="w-5 h-5 accent-emerald-600" />
                        <span className="font-bold text-sm text-slate-700">تمييز كأكثر مبيعاً</span>
                        <Sparkles size={16} className={formData.isBestSeller ? 'text-amber-500' : 'text-slate-200'} />
                    </label>
                </div>
            </div>
          </section>

          <section className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-50 space-y-6">
            <h3 className="font-black text-slate-900 flex items-center gap-3 uppercase tracking-widest text-sm"><ImageIcon size={20}/> معرض الصور</h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.existingImages.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-50">
                  <img src={src} className="w-full h-full object-cover" />
                  <button onClick={() => removeExisting(src)} className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Trash2/></button>
                </div>
              ))}
              {newPreviews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-emerald-200">
                  <img src={src} className="w-full h-full object-cover" />
                  <button onClick={() => removeNew(i)} className="absolute inset-0 bg-rose-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Trash2/></button>
                </div>
              ))}
              <label className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                <UploadCloud className="text-slate-300" />
                <span className="text-[8px] font-black text-slate-400 mt-2">إضافة صور</span>
                <input type="file" multiple onChange={handleNewImages} className="hidden" accept="image/*" />
              </label>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}