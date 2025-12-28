
'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { 
  ArrowRight, Plus, Trash2, UploadCloud, Save, 
  Loader2, Store as StoreIcon, Phone, Mail, MapPin, 
  Info, CircleDashed, Image as ImageIcon 
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

export default function AddStorePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Preview states
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [store, setStore] = useState({
    name: '',
    description: [''],
    address: '',
    phone: '',
    email: '',
    categories: '',
    logo: null as File | null,
    coverImage: null as File | null,
    isActive: true,
  });

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
      const file = e.target.files[0];
      setStore({ ...store, [type]: file });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') setLogoPreview(reader.result as string);
        else setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user?._id) return;
    if (!store.name.trim()) return alert('اسم المتجر مطلوب');
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', store.name);
      formData.append('address', store.address);
      formData.append('phone', store.phone);
      formData.append('email', store.email);
      formData.append('owner', user._id);
      formData.append('isActive', store.isActive.toString());

      store.description.forEach((desc) => {
          if(desc.trim()) formData.append('description', desc);
      });

      const cats = store.categories.split(',').map(c => c.trim()).filter(Boolean);
      cats.forEach((cat) => formData.append('categories', cat));

      if (store.logo) formData.append('logo', store.logo);
      if (store.coverImage) formData.append('coverImage', store.coverImage);

      await api.post('/admin/stores', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      router.push('/admin/stores');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة المتجر');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/stores" className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-emerald-600 hover:shadow-md transition-all">
              <ArrowRight size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">إضافة متجر جديد</h1>
            <p className="text-gray-500 font-medium">قم بتعبئة البيانات لإنشاء هوية المتجر الجديد</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Info size={20} />
               </div>
               <h2 className="text-xl font-black text-gray-800">المعلومات الأساسية</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700">اسم المتجر <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={store.name} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-500 transition-all font-bold" placeholder="مثال: متجر الإلكترونيات" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700">التصنيفات</label>
                    <input type="text" name="categories" value={store.categories} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none border-emerald-500 transition-all font-bold" placeholder="إلكترونيات, جوالات..." />
                </div>
            </div>
            <div className="space-y-4">
                <label className="text-sm font-black text-gray-700 block">وصف ومميزات المتجر</label>
                <div className="space-y-3">
                  {store.description.map((desc, i) => (
                      <div key={i} className="flex gap-3">
                          <input value={desc} onChange={(e) => handleDescriptionChange(e.target.value, i)} className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 focus:outline-none border-emerald-500 transition-all font-medium" />
                          <button type="button" onClick={() => removeDescriptionLine(i)} className="p-3 text-red-500 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors shrink-0 disabled:opacity-30" disabled={store.description.length === 1}>
                              <Trash2 size={20} />
                          </button>
                      </div>
                  ))}
                </div>
                <button type="button" onClick={addDescriptionLine} className="flex items-center gap-2 text-sm font-black text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-5 py-2.5 rounded-xl transition-all"><Plus size={18} /> إضافة سطر جديد</button>
            </div>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
               <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Phone size={20} />
               </div>
               <h2 className="text-xl font-black text-gray-800">بيانات التواصل</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><label className="text-sm font-black text-gray-700 flex items-center gap-2"><MapPin size={16} /> العنوان</label><input type="text" name="address" value={store.address} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold" /></div>
                <div className="space-y-2"><label className="text-sm font-black text-gray-700 flex items-center gap-2"><Phone size={16} /> رقم الهاتف</label><input type="text" name="phone" value={store.phone} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold" dir="ltr" /></div>
                <div className="md:col-span-2 space-y-2"><label className="text-sm font-black text-gray-700 flex items-center gap-2"><Mail size={16} /> البريد الإلكتروني</label><input type="email" name="email" value={store.email} onChange={handleChange} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:border-emerald-500 transition-all font-bold" /></div>
            </div>
          </MotionDiv>
        </div>

        <div className="space-y-8">
          <MotionDiv initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-8">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><ImageIcon size={20} className="text-emerald-500" /> الصور والهوية</h3>
            <div className="space-y-3">
              <label className="block text-sm font-black text-gray-700">شعار المتجر</label>
              <div className="relative group">
                <div className="w-full aspect-square bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center relative transition-all group-hover:border-emerald-500">
                  {logoPreview ? <img src={logoPreview} className="w-full h-full object-cover" /> : <><UploadCloud size={40} className="text-gray-300 mb-2" /><span className="text-xs font-bold text-gray-400">اختر شعار المتجر</span></>}
                  <input type="file" onChange={(e) => handleImageChange(e, 'logo')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-black text-gray-700">صورة الغلاف</label>
              <div className="relative group">
                <div className="w-full aspect-video bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 overflow-hidden flex flex-col items-center justify-center relative transition-all group-hover:border-emerald-500">
                  {coverPreview ? <img src={coverPreview} className="w-full h-full object-cover" /> : <><UploadCloud size={40} className="text-gray-300 mb-2" /><span className="text-xs font-bold text-gray-400">اختر صورة الغلاف</span></>}
                  <input type="file" onChange={(e) => handleImageChange(e, 'coverImage')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>
            </div>
          </MotionDiv>

          <MotionDiv initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 space-y-6">
            <h3 className="text-xl font-black text-gray-800">الحالة</h3>
            <label className="flex items-center gap-4 p-4 bg-emerald-50/50 rounded-2xl cursor-pointer group border border-emerald-100">
                <div className="relative">
                  <input type="checkbox" checked={store.isActive} onChange={(e) => setStore({...store, isActive: e.target.checked})} className="sr-only peer" />
                  <div className="w-12 h-6 bg-gray-200 rounded-full peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-1 after:right-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:-translate-x-6"></div>
                </div>
                <span className="font-black text-sm text-emerald-900">تفعيل المتجر فوراً</span>
            </label>
            <button onClick={handleSubmit} disabled={loading} className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black text-xl hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70 group">
              {loading ? <Loader2 className="animate-spin" /> : <Save size={24} />}
              حفظ المتجر
            </button>
          </MotionDiv>
        </div>
      </div>
    </div>
  );
}