
'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface SearchFilterProps {
  onFilter: (filters: any) => void;
}

export default function SearchFilter({ onFilter }: SearchFilterProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // مزامنة الحقول عند تغير الرابط (مثلاً عند مسح الفلاتر)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ search });
  };

  const handlePriceFilter = () => {
    onFilter({ minPrice, maxPrice });
  };

  return (
    <div className="space-y-10">
      {/* Search Input */}
      <div className="space-y-4">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block pr-2">البحث النصي</label>
        <form onSubmit={handleSearch} className="relative group">
          <input
            type="text"
            placeholder="عن ماذا تبحث؟"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] py-5 pr-14 pl-6 text-sm font-bold focus:outline-none focus:border-emerald-500/30 focus:bg-white transition-all shadow-inner"
          />
          <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
            <Search size={22} />
          </button>
        </form>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest block pr-2">نطاق الاستثمار ($)</label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">من</span>
             <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pr-12 pl-4 text-sm font-black focus:outline-none focus:border-emerald-500/30 transition-all"
             />
          </div>
          <div className="relative">
             <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">إلى</span>
             <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pr-12 pl-4 text-sm font-black focus:outline-none focus:border-emerald-500/30 transition-all"
             />
          </div>
        </div>
        <button 
          onClick={handlePriceFilter}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 mt-2 flex items-center justify-center gap-2 group"
        >
          تطبيق الفلترة <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

      {((searchParams.get('search')) || (searchParams.get('minPrice')) || (searchParams.get('maxPrice'))) && (
        <button 
          onClick={() => onFilter({ search: null, minPrice: null, maxPrice: null, category: null })}
          className="w-full py-2 text-xs font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest"
        >
          مسح كافة التفضيلات
        </button>
      )}
    </div>
  );
}