'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;
  localInventoryNotes?: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);

  useEffect(() => {
    api.get('/admin/categories').then((res) => setCategories(res.data));
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/admin/categories/${id}`);
    setCategories(categories.filter((c) => c._id !== id));
  };

  const handleEdit = (category: Category) => {
    setEditing(category);
  };

  const handleSave = async () => {
    if (editing) {
      await api.put(`/admin/categories/${editing._id}`, editing);
      setEditing(null);
      api.get('/admin/categories').then((res) => setCategories(res.data));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">إدارة الفئات</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>الوصف</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td>
                <button onClick={() => handleEdit(category)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">تعديل</button>
                <button onClick={() => handleDelete(category._id)} className="bg-red-500 text-white px-2 py-1 rounded">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <div className="mt-4">
          <input
            type="text"
            value={editing.name}
            onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            value={editing.description}
            onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            className="border p-2 mr-2"
          />
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">حفظ</button>
        </div>
      )}
    </div>
  );
}