'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User } from '@/lib/types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get('/admin/users').then((res) => setUsers(res.data));
  }, []);

  const handleUpdateRole = async (id: string, role: 'user' | 'admin') => {
    await api.put(`/admin/users/${id}`, { role });
    setUsers(users.map((u) => (u._id === id ? { ...u, role } : u)));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">إدارة المستخدمين</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>البريد</th>
            <th>الدور</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleUpdateRole(user._id, e.target.value as 'user' | 'admin')}
                  className="border p-1"
                >
                  <option value="user">مستخدم</option>
                  <option value="admin">أدمن</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}