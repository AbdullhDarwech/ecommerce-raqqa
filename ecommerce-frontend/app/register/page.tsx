
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowLeft, Loader2, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';

const MotionDiv = motion.div as any;

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // دالة التحقق الوصفي (Descriptive Validation Logic)
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (formData.name.trim().split(' ').length < 2) {
      errors.name = 'يرجى إدخال اسمك ولقبك لتعريف حسابك بشكل رسمي.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'تنسيق البريد الإلكتروني غير صحيح، يرجى التأكد منه.';
    }

    const phoneRegex = /^09[3-9][0-9]{7}$/;
    if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'رقم الهاتف يجب أن يكون سورياً صحيحاً (مثال: 0930123456).';
    }

    if (formData.password.length < 8) {
      errors.password = 'يجب أن تكون كلمة المرور 8 محارف على الأقل لضمان الأمان.';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'كلمتا المرور غير متطابقتين، يرجى إعادة التحقق.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      setError('يرجى تصحيح الملاحظات الموضحة أدناه للمتابعة.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-gray-50">
      <MotionDiv 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-white rounded-[4rem] shadow-3xl overflow-hidden flex flex-col md:flex-row min-h-[800px] border border-slate-100"
      >
        {/* Left Side: Brand Visual */}
        <div className="w-full md:w-1/2 bg-gray-900 relative hidden md:block overflow-hidden">
          <Image
            src="/images/reg.png"
            alt="Furato Elite Registration"
            fill
            className="object-cover opacity-50"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-16 text-white z-10 space-y-6">
            <div className="w-16 h-1 bg-emerald-500 rounded-full" />
            <h2 className="text-5xl font-black leading-tight tracking-tighter">
              انضم إلى <br />
              <span className="text-emerald-400 italic">مجتمع النخبة</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-medium">
              بإنشاء حسابك، ستحصل على وصول حصري لأحدث المقتنيات العالمية والمتاجر المحلية الموثوقة في الرقة.
            </p>
          </div>
        </div>

        {/* Right Side: Detailed Form */}
        <div className="w-full md:w-7/12 p-10 md:p-20 flex flex-col justify-center bg-white">
          <div className="max-w-xl w-full mx-auto space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">إنشاء عضوية جديدة</h1>
              <p className="text-slate-500 font-medium">نحن متحمسون لانضمامك إلينا، يرجى تزويدنا بالبيانات التالية.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence>
                {error && (
                  <MotionDiv 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-rose-50 text-rose-600 text-sm p-6 rounded-3xl flex items-center gap-4 border border-rose-100 shadow-sm"
                  >
                    <AlertCircle size={24} className="shrink-0" />
                    <p className="font-bold">{error}</p>
                  </MotionDiv>
                )}
              </AnimatePresence>

              {/* Name Field */}
              <div className="space-y-3">
                <div className="relative group">
                  <User className={`absolute top-4 right-5 transition-colors ${fieldErrors.name ? 'text-rose-500' : 'text-slate-300 group-focus-within:text-emerald-600'}`} size={20} />
                  <input
                    type="text"
                    placeholder="الاسم الكامل (مثال: أحمد العلي)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pr-14 pl-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold ${fieldErrors.name ? 'border-rose-100 focus:border-rose-300' : 'border-slate-50 focus:border-emerald-500/30 focus:bg-white shadow-inner'}`}
                  />
                </div>
                {fieldErrors.name && <p className="text-[11px] text-rose-500 font-bold pr-2 flex items-center gap-1"><AlertCircle size={10} /> {fieldErrors.name}</p>}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="relative group">
                    <Mail className={`absolute top-4 right-5 transition-colors ${fieldErrors.email ? 'text-rose-500' : 'text-slate-300 group-focus-within:text-emerald-600'}`} size={20} />
                    <input
                      type="email"
                      placeholder="البريد الإلكتروني"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pr-14 pl-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold ${fieldErrors.email ? 'border-rose-100 focus:border-rose-300' : 'border-slate-50 focus:border-emerald-500/30 focus:bg-white shadow-inner'}`}
                    />
                  </div>
                  {fieldErrors.email && <p className="text-[11px] text-rose-500 font-bold pr-2 flex items-center gap-1"><AlertCircle size={10} /> {fieldErrors.email}</p>}
                </div>

                <div className="space-y-3">
                  <div className="relative group">
                    <Phone className={`absolute top-4 right-5 transition-colors ${fieldErrors.phone ? 'text-rose-500' : 'text-slate-300 group-focus-within:text-emerald-600'}`} size={20} />
                    <input
                      type="tel"
                      placeholder="رقم الهاتف السوري"
                      dir="rtl"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pr-14 pl-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold ${fieldErrors.phone ? 'border-rose-100 focus:border-rose-300' : 'border-slate-50 focus:border-emerald-500/30 focus:bg-white shadow-inner'}`}
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-[11px] text-rose-500 font-bold pr-2 flex items-center gap-1"><AlertCircle size={10} /> {fieldErrors.phone}</p>}
                </div>
              </div>

              {/* Passwords Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="relative group">
                    <Lock className={`absolute top-4 right-5 transition-colors ${fieldErrors.password ? 'text-rose-500' : 'text-slate-300 group-focus-within:text-emerald-600'}`} size={20} />
                    <input
                      type="password"
                      placeholder="كلمة المرور"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full pr-14 pl-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold ${fieldErrors.password ? 'border-rose-100 focus:border-rose-300' : 'border-slate-50 focus:border-emerald-500/30 focus:bg-white shadow-inner'}`}
                    />
                  </div>
                  {fieldErrors.password && <p className="text-[11px] text-rose-500 font-bold pr-2 flex items-center gap-1"><AlertCircle size={10} /> {fieldErrors.password}</p>}
                </div>

                <div className="space-y-3">
                  <div className="relative group">
                    <Lock className={`absolute top-4 right-5 transition-colors ${fieldErrors.confirmPassword ? 'text-rose-500' : 'text-slate-300 group-focus-within:text-emerald-600'}`} size={20} />
                    <input
                      type="password"
                      placeholder="تأكيد كلمة المرور"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pr-14 pl-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold ${fieldErrors.confirmPassword ? 'border-rose-100 focus:border-rose-300' : 'border-slate-50 focus:border-emerald-500/30 focus:bg-white shadow-inner'}`}
                    />
                  </div>
                  {fieldErrors.confirmPassword && <p className="text-[11px] text-rose-500 font-bold pr-2 flex items-center gap-1"><AlertCircle size={10} /> {fieldErrors.confirmPassword}</p>}
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <input type="checkbox" required className="mt-1 w-5 h-5 rounded-lg accent-emerald-600 cursor-pointer" />
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  أؤكد موافقتي على <Link href="/terms" className="text-emerald-600 font-bold hover:underline">بروتوكول الخدمة</Link> و <Link href="/privacy" className="text-emerald-600 font-bold hover:underline">سياسة الخصوصية</Link> المعمول بها في منصة فوراتو.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-950 text-white py-6 rounded-3xl font-black text-xl hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-70 group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    إتمام التسجيل <ArrowLeft className="group-hover:-translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-10 border-t border-slate-50 text-center">
              <p className="text-slate-500 font-bold">
                لديك عضوية بالفعل؟{' '}
                <Link href="/login" className="text-emerald-600 hover:text-emerald-500 transition-colors">
                  سجل دخولك من هنا
                </Link>
              </p>
            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}