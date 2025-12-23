
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import SearchFilter from '@/components/SearchFilter';
import CategoriesSidebar from '@/components/CategoriesSidebar';
import api from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { 
  LayoutGrid, List, SlidersHorizontal, 
  PackageSearch, X, Sparkles, Sliders, 
  ArrowLeft, ArrowRight, ChevronDown, Filter, Hash
} from 'lucide-react';

const MotionDiv = motion.div as any;

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProductsContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-2 border-emerald-500/10 rounded-full" />
          <div className="absolute inset-0 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="font-black text-slate-400 text-[10px] uppercase tracking-[0.6em] animate-pulse">Masterpiece Loading...</span>
      </div>
    </div>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get("/products", { params });
      
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || 0);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') {
        current.delete(key);
      } else {
        current.set(key, value);
      }
    });

    // منطق ذكي: إذا تغيرت الفئة، نمسح القسم الفرعي تلقائياً
    if ('category' in newParams) {
      current.delete('subcategory');
    }

    if (!newParams.page) current.set("page", "1");

    router.push(`/products?${current.toString()}`, { scroll: false });
  };

  const activeCategoryId = searchParams.get('category');
  const activeSubcategory = searchParams.get('subcategory');
  const activeCategory = categories.find(c => c._id === activeCategoryId);
  const currentPage = Number(searchParams.get('page')) || 1;

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative pt-20 pb-32 bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        <div className="absolute -bottom-1 left-0 w-full h-64 bg-gradient-to-t from-white via-white/40 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black tracking-[0.5em] uppercase mb-10"
          >
            <Sparkles size={14} /> The Elite Collection
          </MotionDiv>
          
          <h1 className="text-6xl md:text-[9rem] font-black text-white tracking-tighter leading-none mb-10">
            {activeCategory ? (
              <>عالم <span className="italic font-light text-emerald-400">{activeCategory.name}</span></>
            ) : (
              <>المعرض <span className="italic font-light text-emerald-400">الكامل</span></>
            )}
          </h1>

          {/* Top Subcategory Pills (Mirrored from Sidebar) */}
          <AnimatePresence>
            {activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
              <MotionDiv 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-wrap justify-center gap-3 mt-12"
              >
                <button
                  onClick={() => updateQueryParams({ subcategory: null })}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    !activeSubcategory 
                      ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' 
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  الكل
                </button>
                {activeCategory.subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => updateQueryParams({ subcategory: sub })}
                    className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeSubcategory === sub 
                        ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' 
                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. TOOLS & NAVIGATION BAR */}
      <div className="sticky top-[72px] md:top-[88px] z-40 bg-white/80 backdrop-blur-3xl border-y border-slate-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl"
              >
                <Filter size={18} /> تصفية النتائج
              </button>
              
              <div className="hidden lg:flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <LayoutButton active={layout === 'grid'} onClick={() => setLayout('grid')} icon={<LayoutGrid size={18} />} />
                <LayoutButton active={layout === 'list'} onClick={() => setLayout('list')} icon={<List size={18} />} />
              </div>

              <div className="hidden lg:block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                تحليل <span className="text-slate-900">{totalItems}</span> مقتنيات فريدة
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest hidden sm:block">ترتيب البروتوكول</span>
              <div className="relative">
                <select 
                  onChange={(e) => updateQueryParams({ sort: e.currentTarget.value })}
                  value={searchParams.get('sort') || ''}
                  className="appearance-none bg-slate-50 border border-slate-100 rounded-xl px-12 py-3.5 font-black text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer pr-14"
                >
                  <option value="">الأحدث أولاً</option>
                  <option value="price_asc">السعر: التصاعدي</option>
                  <option value="price_desc">السعر: التنازلي</option>
                </select>
                <ChevronDown size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN GALLERY GRID */}
      <div className="container mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Sidebar */}
          <aside className="hidden lg:block w-80 shrink-0 space-y-16">
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em]">البحث الذكي</h3>
              </div>
              <SearchFilter onFilter={(f) => updateQueryParams(f)} />
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-4">
                 <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.4em]">التصنيفات</h3>
              </div>
              <CategoriesSidebar 
                selectedCategory={activeCategoryId || ''} 
                onSelect={(f) => updateQueryParams(f)} 
              />
            </section>
          </aside>

          {/* Gallery View */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-16">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[3/4] bg-slate-50 rounded-[4rem] animate-pulse" />)}
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-24">
                <MotionDiv
                  layout
                  className={
                    layout === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-24'
                      : 'flex flex-col gap-10'
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product, idx) => (
                      <MotionDiv
                        key={product._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.7, delay: idx * 0.05 }}
                      >
                        <ProductCard product={product} />
                      </MotionDiv>
                    ))}
                  </AnimatePresence>
                </MotionDiv>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center gap-10 pt-20 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <PaginationBtn onClick={() => updateQueryParams({ page: (currentPage - 1).toString() })} disabled={currentPage === 1} icon={<ArrowRight size={24} />} />
                      <div className="flex gap-3">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            onClick={() => updateQueryParams({ page: p.toString() })}
                            className={`w-14 h-14 rounded-2xl font-black text-sm transition-all duration-500 ${
                              currentPage === p 
                                ? 'bg-slate-900 text-white shadow-2xl scale-110' 
                                : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                      <PaginationBtn onClick={() => updateQueryParams({ page: (currentPage + 1).toString() })} disabled={currentPage === totalPages} icon={<ArrowLeft size={24} />} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <MotionDiv 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-center py-40 bg-slate-50 rounded-[5rem] border-2 border-dashed border-slate-200"
              >
                <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-3xl text-slate-200">
                  <PackageSearch size={64} />
                </div>
                <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tighter">الأرشيف لا يستجيب</h3>
                <p className="text-slate-400 text-xl font-medium mb-12 max-w-md mx-auto">لم نعثر على مقتنيات مطابقة لهذه المعايير حالياً. جرب توسيع نطاق البحث.</p>
                <button 
                  onClick={() => router.push('/products')} 
                  className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-3xl"
                >
                  إعادة ضبط البروتوكول
                </button>
              </MotionDiv>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters UI */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileFilters(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[200]" />
            <MotionDiv 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-[210] p-12 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-16">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">تعديل البحث</h3>
                <button onClick={() => setShowMobileFilters(false)} className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><X size={28} /></button>
              </div>
              <div className="space-y-16">
                <SearchFilter onFilter={(f) => { updateQueryParams(f); setShowMobileFilters(false); }} />
                <CategoriesSidebar selectedCategory={activeCategoryId || ''} onSelect={(f) => { updateQueryParams(f); setShowMobileFilters(false); }} />
              </div>
            </MotionDiv>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function LayoutButton({ active, onClick, icon }: any) {
  return (
    <button onClick={onClick} className={`p-3.5 rounded-xl transition-all ${active ? 'bg-white text-emerald-600 shadow-xl scale-110' : 'text-slate-300 hover:text-slate-600'}`}>
      {icon}
    </button>
  );
}

function PaginationBtn({ onClick, disabled, icon }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${disabled ? 'opacity-20 cursor-not-allowed bg-slate-50' : 'bg-white border border-slate-100 hover:bg-emerald-600 hover:text-white shadow-xl'}`}>
      {icon}
    </button>
  );
}