'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';
import { Shield, User as UserIcon, Loader2, Search, Trash2, Filter, AlertTriangle } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const deleteUser = async (id: string) => {
    if (!confirm('تحذير: هل أنت متأكد تماماً من حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.')) return;
    
    setUpdating(id);
    try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
    } catch (error) {
        alert('فشل حذف المستخدم');
    } finally {
        setUpdating(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="animate-spin text-emerald-600" size={32} />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <h1 className="text-3xl font-bold text-gray-900">المستخدمين</h1>
         <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold text-sm">
            {users.length} مستخدم
         </span>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="بحث بالاسم، البريد، أو الهاتف..." 
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">المستخدم</th>
                <th className="px-6 py-4 font-bold text-gray-700">معلومات الاتصال</th>
                <th className="px-6 py-4 font-bold text-gray-700">الدور</th>
                <th className="px-6 py-4 font-bold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">منذ {user._id.substring(0,8)}...</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    <p>{user.email}</p>
                    {user.phone && <p dir="ltr" className="text-xs text-gray-400">{user.phone}</p>}
                  </td>
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
                    <div className="flex items-center gap-3">
                        <button
                        disabled={updating === user._id}
                        onClick={() => toggleRole(user)}
                        className="text-xs font-bold bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                        >
                        {updating === user._id ? <Loader2 size={16} className="animate-spin" /> : 'تغيير الصلاحية'}
                        </button>
                        
                        <button
                            disabled={updating === user._id}
                            onClick={() => deleteUser(user._id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف المستخدم"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
             <div className="text-center py-10 text-gray-500">لا يوجد مستخدمين مطابقين</div>
        )}
      </div>
    </div>
  );
}