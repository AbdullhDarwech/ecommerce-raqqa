'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFilterProps {
  onFilter: (filters: any) => void;
}

export default function SearchFilter({ onFilter }: SearchFilterProps) {
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ search });
  };

  const handlePriceFilter = () => {
    onFilter({ minPrice, maxPrice });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
         <SlidersHorizontal size={18} className="text-emerald-600" />
         <h3 className="font-bold text-gray-800">بحث وفلترة</h3>
      </div>

      {/* Text Search */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <input
          type="text"
          placeholder="اسم المنتج..."
          value={search}
          onChange={(e) => setSearch((e.target as HTMLInputElement).value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 pl-10 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button type="submit" className="absolute left-3 top-3.5 text-gray-400 hover:text-emerald-600">
          <Search size={18} />
        </button>
      </form>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">نطاق السعر ($)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="من"
            value={minPrice}
            onChange={(e) => setMinPrice((e.target as HTMLInputElement).value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500"
          />
          <input
            type="number"
            placeholder="إلى"
            value={maxPrice}
            onChange={(e) => setMaxPrice((e.target as HTMLInputElement).value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button 
          onClick={handlePriceFilter}
          className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors mt-2"
        >
          تطبيق
        </button>
      </div>
    </div>
  );
}