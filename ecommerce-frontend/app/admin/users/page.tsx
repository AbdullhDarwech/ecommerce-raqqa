'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';
import { Shield, User as UserIcon, Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`هل أنت متأكد من تغيير صلاحية ${user.name} إلى ${newRole}؟`)) return;
    
    setUpdating(user._id);
    try {
      await api.put(`/admin/users/${user._id}`, { role: newRole });
      setUsers(users.map(u => u._id === user._id ? { ...u, role: newRole } : u));
    } catch (error) {
      alert('فشل تحديث الصلاحية');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="text-center py-12">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">المستخدمين</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">الاسم</th>
                <th className="px-6 py-4 font-bold text-gray-700">البريد الإلكتروني</th>
                <th className="px-6 py-4 font-bold text-gray-700">الدور</th>
                <th className="px-6 py-4 font-bold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                     {user.role === 'admin' ? (
                       <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                         <Shield size={14} /> مسؤول
                       </span>
                     ) : (
                       <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
                         <UserIcon size={14} /> مستخدم
                       </span>
                     )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      disabled={updating === user._id}
                      onClick={() => toggleRole(user)}
                      className="text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline disabled:opacity-50"
                    >
                      {updating === user._id ? <Loader2 size={16} className="animate-spin" /> : 'تغيير الصلاحية'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}