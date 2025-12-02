'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    api.get('/admin/products').then((res) => setProducts(res.data));
  }, []);

  const handleDelete = async (id: string) => {
    await api.delete(`/admin/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
  };

  const handleSave = async () => {
    if (editing) {
      await api.put(`/admin/products/${editing._id}`, editing);
      setEditing(null);
      api.get('/admin/products').then((res) => setProducts(res.data));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">إدارة المنتجات</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>الاسم</th>
            <th>السعر</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.pricePurchase}</td>
              <td>
                <button onClick={() => handleEdit(product)} className="bg-blue-500 text-white px-2 py-1 rounded mr-2">تعديل</button>
                <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white px-2 py-1 rounded">حذف</button>
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
          <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">حفظ</button>
        </div>
      )}
    </div>
  );
}