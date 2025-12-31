
'use client';

import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { 
  ArrowRight, Save, Loader2, Info, Phone, 
  Image as ImageIcon, AlertCircle, Check, X,
  Facebook, Instagram, MessageCircle, Globe, Camera,
  RefreshCw, Sparkles, Clock, MapPin
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

/**
 * وظيفة لضغط الصور برمجياً قبل الرفع لتسريع العملية
 */
const compressImage = (file: File, maxWidth = 1200, quality = 0.7): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
    };
  });
};

export default function EditStorePage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = routeParams.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [store, setStore] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    workingHours: '',
    facebook: '',
    instagram: '',
    whatsapp: '',
    logo: null as File | null,
    coverImage: null as File | null,
    currentLogo: '', 
    currentCover: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchStore = async () => {
      try {
        setFetching(true);
        const res = await api.get(`/admin/stores/${id}`);
        const data = res.data;
        setStore({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          workingHours: data.workingHours || '',
          facebook: data.socialLinks?.facebook || '',
          instagram: data.socialLinks?.instagram || '',
          whatsapp: data.socialLinks?.whatsapp || '',
          logo: null,
          coverImage: null,
          currentLogo: data.logo || '',
          currentCover: data.coverImage || '',
          isActive: data.isActive !== undefined ? data.isActive : true,
        });
      } catch (err: any) {
        setError('تعذر جلب البيانات. يرجى التحقق من اتصالك.');
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchStore();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStore(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // معاينة فورية لتحسين تجربة المستخدم
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') setLogoPreview(reader.result as string);
        else setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // ضغط الصورة في الخلفية لتسريع الرفع لاحقاً
      const compressed = await compressImage(file, type === 'logo' ? 400 : 1200);
      setStore(prev => ({ 
        ...prev, 
        [type === 'logo' ? 'logo' : 'coverImage']: compressed 
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const formData = new FormData();
      Object.keys(store).forEach(key => {
        if (!['logo', 'coverImage', 'currentLogo', 'currentCover'].includes(key)) {
          formData.append(key, (store as any)[key]);
        }
      });
      
      if (store.logo) formData.append('logo', store.logo);
      if (store.coverImage) formData.append('coverImage', store.coverImage);

      // زيادة مهلة الطلب لـ 45 ثانية لمواجهة بطء رفع الصور إلى Cloudinary
      await api.put(`/admin/stores/${id}`, formData, { 
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 45000 
      });

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => router.push('/admin/stores'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'فشل التحديث. يرجى محاولة رفع صورة أصغر حجماً.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col justify-center items-center h-[70vh] gap-4">
      <Loader2 className="animate-spin text-emerald-600" size={56} />
      <p className="text-gray-500 font-black animate-pulse">جاري جلب البيانات...</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl pb-32">
      <div className="flex items-center gap-6 mb-12">
        <Link href="/admin/stores" className="p-4 bg-white border border-gray-100 rounded-[1.5rem] text-gray-400 hover:text-emerald-600 transition-all shadow-sm">
          <ArrowRight size={24} />
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">تعديل المتجر</h1>
          <p className="text-gray-500 font-medium">قم بتحديث هوية المتجر وبيانات التواصل الاجتماعي</p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <MotionDiv initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8 bg-rose-50 text-rose-600 p-6 rounded-3xl flex items-center gap-4 border border-rose-100 font-bold">
            <AlertCircle /> {error}
          </MotionDiv>
        )}
        {success && (
          <MotionDiv initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8 bg-emerald-50 text-emerald-600 p-6 rounded-3xl flex items-center gap-4 border border-emerald-100 font-bold">
            <Check /> تم حفظ التعديلات بنجاح!
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Identity Section */}
          <div className="bg-white rounded-[3.5rem] p-1 shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-56 bg-gray-50 group">
              <img 
                src={coverPreview || store.currentCover || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200'} 
                className="w-full h-full object-cover transition-all group-hover:scale-105" 
              />
              <label className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white font-black gap-2">
                <Camera size={32} />
                <span>تغيير صورة الغلاف</span>
                <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'cover')} accept="image/*" />
              </label>
            </div>
            <div className="px-10 pb-10">
               <div className="relative -mt-20 w-40 h-40 bg-white p-2 rounded-[3rem] shadow-2xl border-8 border-white group/logo overflow-hidden">
                  <img src={logoPreview || store.currentLogo || '/placeholder.png'} className="w-full h-full object-cover rounded-[2.5rem]" />
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Camera className="text-white" size={32} />
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'logo')} accept="image/*" />
                  </label>
               </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-100 space-y-10">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-4 border-b border-gray-50 pb-6"><Info className="text-emerald-500" /> المعلومات العامة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <InputField label="اسم المتجر" name="name" value={store.name} onChange={handleChange} />
               <InputField label="رقم الهاتف" name="phone" value={store.phone} onChange={handleChange} dir="ltr" />
               <InputField label="البريد الإلكتروني" name="email" value={store.email} onChange={handleChange} />
               <InputField label="ساعات العمل" name="workingHours" value={store.workingHours} onChange={handleChange} placeholder="مثال: 9:00 AM - 11:00 PM" />
            </div>
            <InputField label="العنوان" name="address" value={store.address} onChange={handleChange} />
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-[3.5rem] p-10 shadow-sm border border-gray-100 space-y-10">
            <h2 className="text-2xl font-black text-gray-800 flex items-center gap-4 border-b border-gray-50 pb-6"><Globe className="text-emerald-500" /> روابط التواصل الاجتماعي</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Facebook size={14} className="text-blue-600" /> فيسبوك</label>
                 <input name="facebook" value={store.facebook} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-4 focus:ring-blue-500/10" placeholder="رابط الصفحة" />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Instagram size={14} className="text-rose-500" /> إنستغرام</label>
                 <input name="instagram" value={store.instagram} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-4 focus:ring-rose-500/10" placeholder="اسم المستخدم" />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><MessageCircle size={14} className="text-emerald-500" /> واتساب</label>
                 <input name="whatsapp" value={store.whatsapp} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-4 focus:ring-emerald-500/10" placeholder="09xxxxxxxx" />
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 space-y-8 sticky top-28">
            <h3 className="text-xl font-black text-gray-900 border-b pb-6">الإجراءات</h3>
            <div className="space-y-4">
              <button 
                onClick={() => setStore(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`w-full py-5 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-3 ${
                  store.isActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}
              >
                {store.isActive ? <Check size={20} /> : <X size={20} />}
                {store.isActive ? 'المتجر متاح للعامة' : 'المتجر مخفي حالياً'}
              </button>
            </div>
            
            <div className="pt-4 space-y-4">
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-6 rounded-[2rem] font-black text-2xl hover:bg-emerald-700 shadow-3xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={28} />}
                {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
              {loading && (
                <p className="text-[10px] text-gray-400 text-center animate-pulse px-4">
                  يتم الآن ضغط الصور ورفعها للسيرفر.. يرجى عدم إغلاق الصفحة.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function InputField({ label, name, value, onChange, dir = 'rtl', placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-black text-gray-500 block">{label}</label>
      <input 
        type="text" 
        name={name} 
        value={value} 
        onChange={onChange} 
        dir={dir}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 font-bold focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all text-gray-800" 
      />
    </div>
  );
}