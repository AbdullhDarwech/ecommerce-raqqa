'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Category } from '@/lib/types';
import { Folder } from 'lucide-react';

export default function DashboardCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p className="text-center text-2xl mt-20">جاري التحميل...</p>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-raqqa-river">الفئات</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((category) => (
          <div key={category._id} className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <div className="grid grid-cols-2 gap-4">
              {category.subcategories?.map((sub) => (
                <Link key={sub} href={`/dashboard/categories/${category.name}/${sub}`} className="bg-raqqa-sand p-4 rounded text-center hover:bg-raqqa-green transition">
                  {sub}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}