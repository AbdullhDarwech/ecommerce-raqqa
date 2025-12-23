
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Category } from '@/lib/types';
import { ChevronLeft, Layers, Hash, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

interface CategoriesSidebarProps {
  selectedCategory?: string;
  onSelect: (filters: { category?: string; subcategory?: string | null }) => void;
}

export default function CategoriesSidebar({ selectedCategory, onSelect }: CategoriesSidebarProps) {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const activeSubcategory = searchParams.get('subcategory');

  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-14 bg-slate-50 rounded-2xl" />)}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Option: View All */}
      <button
        onClick={() => onSelect({ category: '', subcategory: null })}
        className={`w-full text-right px-6 py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-between group ${
          !selectedCategory 
            ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
            : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
        }`}
      >
        <div className="flex items-center gap-3 uppercase tracking-widest">
            <Layers size={16} />
            <span>عرض كافة المجموعات</span>
        </div>
        {!selectedCategory && <ChevronLeft size={16} />}
      </button>

      {/* Category List with Subcategories */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat._id;
          return (
            <div key={cat._id} className="space-y-1">
              <button
                onClick={() => onSelect({ category: cat._id, subcategory: null })}
                className={`w-full text-right px-6 py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-between group ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' 
                    : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <div className="flex items-center gap-3 uppercase tracking-widest">
                  <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive ? 'bg-white' : 'bg-emerald-500'}`} />
                  <span>{cat.name}</span>
                </div>
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  <ChevronDown size={14} className={`transition-transform duration-500 ${isActive ? 'rotate-180' : ''}`} />
                ) : (
                  isActive && <ChevronLeft size={16} />
                )}
              </button>

              {/* Subcategories Reveal */}
              <AnimatePresence>
                {isActive && cat.subcategories && cat.subcategories.length > 0 && (
                  <MotionDiv
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pr-4 py-1 space-y-1"
                  >
                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => onSelect({ subcategory: sub })}
                        className={`w-full text-right px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${
                          activeSubcategory === sub
                            ? 'bg-emerald-50 text-emerald-700 border-r-4 border-emerald-600'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-50'
                        }`}
                      >
                        <Hash size={12} className={activeSubcategory === sub ? 'text-emerald-600' : 'text-slate-300'} />
                        {sub}
                      </button>
                    ))}
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}