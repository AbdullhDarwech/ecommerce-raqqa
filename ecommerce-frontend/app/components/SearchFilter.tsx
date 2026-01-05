
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, ArrowLeft, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

const MotionDiv = motion.div as any;

interface SearchFilterProps {
  onFilter: (filters: any) => void;
  autoFocus?: boolean;
}

export default function SearchFilter({ onFilter, autoFocus }: SearchFilterProps) {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  // تفعيل التركيز التلقائي عند طلب ذلك
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [autoFocus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ search });
  };

  const handlePriceFilter = () => {
    onFilter({ minPrice, maxPrice });
  };

  return (
    <div className="space-y-12">
      {/* Search Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.3em] block">بروتوكول البحث</label>
          <Search size={14} className="text-emerald-500/30" />
        </div>
        <form onSubmit={handleSearch} className="relative group">
          <input
            ref={inputRef}
            type="text"
            placeholder="ابحث في المقتنيات..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-stone-50 border-2 border-stone-100 rounded-[1.5rem] py-5 pr-14 pl-6 text-sm font-bold focus:outline-none focus:border-emerald-500/20 focus:bg-white transition-all shadow-inner placeholder:text-stone-300"
          />
          <button type="submit" className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-emerald-600 transition-colors">
            <Search size={22} strokeWidth={2.5} />
          </button>
        </form>
      </div>

      {/* Price Range */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-2">
          <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.3em] block">نطاق الاستثمار ($)</label>
          <SlidersHorizontal size={14} className="text-amber-500/30" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <PriceInput value={minPrice} onChange={setMinPrice} label="من" />
          <PriceInput value={maxPrice} onChange={setMaxPrice} label="إلى" />
        </div>
        <MotionDiv whileTap={{ scale: 0.98 }}>
          <button 
            onClick={handlePriceFilter}
            className="w-full bg-emerald-950 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-950/10 flex items-center justify-center gap-3 group"
          >
            تطبيق الفلترة السيادية <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </MotionDiv>
      </div>

      {((searchParams.get('search')) || (searchParams.get('minPrice')) || (searchParams.get('maxPrice'))) && (
        <button 
          onClick={() => onFilter({ search: null, minPrice: null, maxPrice: null, category: null })}
          className="w-full py-4 text-[9px] font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-[0.3em] flex items-center justify-center gap-2 border-2 border-dashed border-rose-100 rounded-2xl hover:bg-rose-50"
        >
          <X size={14} /> مسح بروتوكولات الفلترة
        </button>
      )}
    </div>
  );
}

function PriceInput({ value, onChange, label }: { value: string, onChange: (v: string) => void, label: string }) {
  return (
    <div className="relative group">
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-stone-300 uppercase tracking-widest pointer-events-none group-focus-within:text-emerald-500 transition-colors">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl py-4 pr-12 pl-4 text-xs font-black text-emerald-950 focus:outline-none focus:border-emerald-500/20 focus:bg-white transition-all shadow-inner"
      />
    </div>
  );
}
