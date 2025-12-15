'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Category {
  _id: string;
  name: string;
  subcategories?: string[];
}

export default function CategoriesSidebar({
  onSelect,
}: {
  onSelect: (filters: Record<string, string>) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    api.get('/categories').then((res) => {
      setCategories(res.data);
    });
  }, []);

  const toggleCategory = (id: string) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <div className="w-64 bg-white border rounded p-4 shadow-sm h-fit">
      <h2 className="text-xl font-bold mb-3">الفئات</h2>

      {categories.map((cat) => (
        <div key={cat._id} className="mb-2">
          {/* الفئة الرئيسية */}
          <button
            className="w-full text-right font-semibold p-2 bg-gray-100 rounded hover:bg-gray-200"
            onClick={() => {
              toggleCategory(cat._id);
              onSelect({ category: cat.name }); // فلترة مباشرة
            }}
          >
            {cat.name}
          </button>

          {/* الفئات الفرعية */}
          {openCategory === cat._id && cat.subcategories?.length ? (
            <ul className="mr-4 mt-2 text-sm border-r pr-2">
              {cat.subcategories.map((sub) => (
                <li
                  key={sub}
                  className="p-1 cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    onSelect({
                      category: cat.name,
                      subcategory: sub,
                    })
                  }
                >
                  {sub}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ))}
    </div>
  );
}
