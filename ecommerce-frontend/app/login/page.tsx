'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', formData);
      // نفترض أن الباك اند يعيد { token: "...", user: { ... } }
      login(res.data.token, res.data.user);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
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
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* الجانب الأيمن: الترحيب والصورة */}
        <div className="w-full md:w-1/2 bg-gray-900 relative hidden md:block">
          <Image
            src="/images/31.jpg"
            alt="Login Banner"
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
              أهلاً بك مجدداً في <br />
              <span className="text-emerald-400">سوق الرقة</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-lg leading-relaxed"
            >
              سجل دخولك لتتابع رحلة التسوق وتستفيد من أحدث العروض والخصومات الحصرية.
            </motion.p>
          </div>
        </div>

        {/* الجانب الأيسر: نموذج الدخول */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900">تسجيل الدخول</h2>
              <p className="mt-2 text-sm text-gray-600">
                أدخل بيانات حسابك للمتابعة
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="space-y-4">
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
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer" />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors">تذكرني</span>
                </label>
                <Link href="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
                  نسيت كلمة المرور؟
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/30 transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    تسجيل الدخول <ArrowLeft size={20} />
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
                  <span className="px-4 bg-white text-gray-500">أو</span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/register" className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors">
                أنشئ حساباً جديداً
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}