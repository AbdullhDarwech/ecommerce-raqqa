'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';

export default function AuthForm() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // تسجيل دخول الأدمن
      const { data } = await api.post('/auth/login', form);

      if (data.token) {
        login(data.token); // حفظ التوكن في AuthProvider / localStorage
        router.push('/admin/dashboard'); // إعادة التوجيه للـ Dashboard
      } else {
        setError('لم يتم العثور على التوكن في الاستجابة');
      }
    } catch (err: any) {
      console.error('Error during admin login:', err);
      setError(err.response?.data?.error || err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-center">تسجيل دخول الأدمن</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="email"
        placeholder="البريد الإلكتروني"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <input
        type="password"
        placeholder="كلمة المرور"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 text-white rounded bg-green-600 hover:bg-green-700 transition ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'جارٍ تسجيل الدخول...' : 'دخول'}
      </button>
    </form>
  );
}
