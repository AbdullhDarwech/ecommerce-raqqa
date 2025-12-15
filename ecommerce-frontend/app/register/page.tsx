'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowLeft, Loader2, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      // إرسال البيانات للباك اند (باستثناء confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
      // التوجيه يتم داخل دالة register في الـ context
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]"
      >
        {/* الجانب الأيمن: الترحيب والصورة */}
        <div className="w-full md:w-5/12 bg-gray-900 relative hidden md:block">
          <Image
            src="/images/42.jpg"
            alt="Register Banner"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white z-10">
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-4"
            >
              انضم لعائلة <br />
              <span className="text-emerald-400">سوق الرقة</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              أنشئ حسابك الآن واستمتع بتجربة تسوق فريدة، تتبع طلباتك، واحصل على كوبونات خصم خاصة بالأعضاء الجدد.
            </motion.p>
          </div>
        </div>

        {/* الجانب الأيسر: نموذج التسجيل */}
        <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <div className="max-w-lg w-full mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">إنشاء حساب جديد</h2>
              <p className="mt-2 text-sm text-gray-600">
                املأ البيانات التالية للبدء
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-50 text-red-600 text-sm p-4 rounded-xl flex items-center gap-3 border border-red-100"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              <div className="relative group">
                <div className="absolute top-3.5 right-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="الاسم الكامل"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: (e.target as HTMLInputElement).value })}
                  className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-800 placeholder:text-gray-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative group">
                    <div className="absolute top-3.5 right-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Mail size={20} />
                    </div>
                    <input
                    type="email"
                    required
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: (e.target as HTMLInputElement).value })}
                    className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-800 placeholder:text-gray-400 font-medium"
                    />
                </div>
                <div className="relative group">
                    <div className="absolute top-3.5 right-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Phone size={20} />
                    </div>
                    <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: (e.target as HTMLInputElement).value })}
                    className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-800 placeholder:text-gray-400 font-medium"
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative group">
                  <div className="absolute top-3.5 right-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="كلمة المرور"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: (e.target as HTMLInputElement).value })}
                    className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-800 placeholder:text-gray-400 font-medium"
                  />
                </div>

                <div className="relative group">
                  <div className="absolute top-3.5 right-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="تأكيد كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: (e.target as HTMLInputElement).value })}
                    className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-gray-800 placeholder:text-gray-400 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-600 mt-2">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                <span>
                  أوافق على <Link href="/terms" className="text-emerald-600 hover:underline">الشروط والأحكام</Link> و <Link href="/privacy" className="text-emerald-600 hover:underline">سياسة الخصوصية</Link>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    إنشاء الحساب <ArrowLeft size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">أو سجل عبر</span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                سجل دخولك هنا
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}