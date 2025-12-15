'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Assuming your backend supports pagination or returns all for now
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      alert('فشل حذف المنتج');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-12">جاري التحميل...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">المنتجات</h1>
        <Link 
          href="/admin/products/add" 
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> إضافة منتج
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="بحث عن منتج..." 
            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
          />
        </div>
        <button className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 text-gray-600">
           <Filter size={20} />
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-700">المنتج</th>
                <th className="px-6 py-4 font-bold text-gray-700">السعر</th>
                <th className="px-6 py-4 font-bold text-gray-700">المخزون</th>
                <th className="px-6 py-4 font-bold text-gray-700">الفئة</th>
                <th className="px-6 py-4 font-bold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {product.images?.[0] && (
                           <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <span className="font-bold text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-emerald-600">${product.pricePurchase}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stockQuantity} قطعة
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {typeof product.category === 'object' ? product.category?.name : '---'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/products/edit/${product._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-500">لا توجد منتجات مطابقة</div>
        )}
      </div>
    </div>
  );
}