'use client';
import { useState } from 'react';
import api from '@/lib/api';

export default function DashboardSettings() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put('/users/profile', form);
    alert('تم تحديث الإعدادات');
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-raqqa-river">الإعدادات</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
        <input
          type="text"
          placeholder="الاسم"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-3 rounded"
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-3 rounded"
        />
        <input
          type="text"
          placeholder="الهاتف"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border p-3 rounded"
        />
        <button type="submit" className="bg-raqqa-green text-white px-6 py-3 rounded-lg">حفظ</button>
      </form>
    </div>
  );
}