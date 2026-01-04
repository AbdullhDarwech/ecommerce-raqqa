
'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import SearchFilter from '@/components/SearchFilter';
import CategoriesSidebar from '@/components/CategoriesSidebar';
import api from '@/lib/api';
import { Product, Category, Store } from '@/lib/types';
import Image from 'next/image';
import { 
  LayoutGrid, List, PackageSearch, X, Sparkles, 
  ArrowLeft, ArrowRight, ChevronDown, Filter, Store as StoreIcon, Globe, ShieldCheck
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
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-2 border-emerald-500/10 rounded-full" />
          <div className="absolute inset-0 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <span className="font-bold text-emerald-900/40 text-[10px] uppercase tracking-[0.4em] animate-pulse">Syncing Collections...</span>
      </div>
    </div>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const fetchStoreInfo = useCallback(async (storeId: string) => {
    try {
      const res = await api.get(`/stores/${storeId}`);
      setSelectedStore(res.data);
    } catch (err) {
      console.error("Store info error", err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get("/products", { params });
      
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || 0);

      if (params.store) {
        fetchStoreInfo(params.store);
      } else {
        setSelectedStore(null);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchParams, fetchStoreInfo]);

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
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. CINEMATIC STORE/COLLECTION HEADER */}
      <section className="relative pt-40 pb-24 bg-emerald-950 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute -bottom-1 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            
            {/* Store Specific Identity Branding */}
            <AnimatePresence mode="wait">
              {selectedStore ? (
                <MotionDiv 
                  key="store-brand"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-6 mb-8"
                >
                  <div className="relative w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-2xl border border-white/20">
                    <Image 
                      src={selectedStore.logo || '/placeholder.png'} 
                      alt={selectedStore.name} 
                      fill 
                      className="object-cover rounded-[2.2rem]" 
                      unoptimized 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-amber-400 text-emerald-950 p-1.5 rounded-xl shadow-lg border-2 border-white">
                      <ShieldCheck size={20} />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[9px] font-black tracking-widest uppercase">
                      Official Partner Boutique
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight">
                      معرض <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">{selectedStore.name}</span>
                    </h1>
                    {selectedStore.description && (
                      <p className="text-emerald-100/60 max-w-xl mx-auto text-sm font-medium mt-4">
                        {selectedStore.description[0]}
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={() => updateQueryParams({ store: null })}
                    className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all mt-6 shadow-2xl"
                  >
                    <Globe size={14} /> الخروج من المتجر والعودة للمعرض العام
                  </button>
                </MotionDiv>
              ) : (
                <MotionDiv 
                  key="general-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-amber-400 text-[9px] font-black tracking-[0.4em] uppercase mb-8 shadow-2xl">
                    <Sparkles size={12} /> The Elite Collection
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight mb-8">
                    {activeCategory ? (
                      <>مجموعة <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">{activeCategory.name}</span></>
                    ) : (
                      <>المعرض <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">السيادي</span></>
                    )}
                  </h1>
                </MotionDiv>
              )}
            </AnimatePresence>

            {/* Subcategories Filter for non-store view or specific category view */}
            <AnimatePresence>
              {!selectedStore && activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
                <MotionDiv 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-wrap justify-center gap-2 mt-4"
                >
                  <button
                    onClick={() => updateQueryParams({ subcategory: null })}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      !activeSubcategory 
                        ? 'bg-amber-500 text-emerald-950 shadow-lg shadow-amber-500/20' 
                        : 'bg-white/5 text-emerald-100/50 hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    الكل
                  </button>
                  {activeCategory.subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => updateQueryParams({ subcategory: sub })}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeSubcategory === sub 
                          ? 'bg-amber-500 text-emerald-950 shadow-lg shadow-amber-500/20' 
                          : 'bg-white/5 text-emerald-100/50 hover:bg-white/10 hover:text-white border border-white/10'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </MotionDiv>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 2. FILTER STRIP */}
      <div className="sticky top-[72px] md:top-[88px] z-40 bg-white/90 backdrop-blur-2xl border-b border-emerald-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-6 py-3 bg-emerald-950 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl"
              >
                <Filter size={16} /> تصفية
              </button>
              
              <div className="hidden lg:flex items-center gap-3 bg-stone-50 p-1.5 rounded-xl border border-stone-100">
                <LayoutButton active={layout === 'grid'} onClick={() => setLayout('grid')} icon={<LayoutGrid size={16} />} />
                <LayoutButton active={layout === 'list'} onClick={() => setLayout('list')} icon={<List size={16} />} />
              </div>

              <div className="hidden lg:block text-[9px] font-black text-stone-400 uppercase tracking-widest">
                عرض <span className="text-emerald-950">{totalItems}</span> مقتنى {selectedStore ? `من متجر ${selectedStore.name}` : ''}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-stone-400 font-black text-[9px] uppercase tracking-widest hidden sm:block">بروتوكول الترتيب</span>
              <div className="relative">
                <select 
                  onChange={(e) => updateQueryParams({ sort: e.currentTarget.value })}
                  value={searchParams.get('sort') || ''}
                  className="appearance-none bg-stone-50 border border-stone-100 rounded-xl px-10 py-2.5 font-bold text-[11px] text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-500/10 cursor-pointer pr-12"
                >
                  <option value="">المضاف حديثاً</option>
                  <option value="price_asc">القيمة: الأقل أولاً</option>
                  <option value="price_desc">القيمة: الأعلى أولاً</option>
                </select>
                <ChevronDown size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <aside className="hidden lg:block w-72 shrink-0 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-1 h-4 bg-emerald-600 rounded-full" />
                 <h3 className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.3em]">البحث الذكي</h3>
              </div>
              <SearchFilter onFilter={(f) => updateQueryParams(f)} />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-1 h-4 bg-amber-500 rounded-full" />
                 <h3 className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.3em]">المجموعات</h3>
              </div>
              <CategoriesSidebar 
                selectedCategory={activeCategoryId || ''} 
                onSelect={(f) => updateQueryParams(f)} 
              />
            </section>
          </aside>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[3/4] bg-stone-50 rounded-[2rem] animate-pulse border border-emerald-50/50" />)}
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-16">
                <MotionDiv
                  layout
                  className={
                    layout === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12'
                      : 'flex flex-col gap-6'
                  }
                >
                  <AnimatePresence mode="popLayout">
                    {products.map((product, idx) => (
                      <MotionDiv
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.5, delay: idx * 0.05 }}
                      >
                        <ProductCard product={product} layout={layout} />
                      </MotionDiv>
                    ))}
                  </AnimatePresence>
                </MotionDiv>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-3 pt-12 border-t border-emerald-50">
                    <PaginationBtn onClick={() => updateQueryParams({ page: (currentPage - 1).toString() })} disabled={currentPage === 1} icon={<ArrowRight size={20} />} />
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => updateQueryParams({ page: p.toString() })}
                          className={`w-10 h-10 rounded-xl font-black text-xs transition-all duration-300 ${
                            currentPage === p ? 'bg-emerald-950 text-white shadow-xl' : 'bg-white text-stone-400 border border-stone-100 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <PaginationBtn onClick={() => updateQueryParams({ page: (currentPage + 1).toString() })} disabled={currentPage === totalPages} icon={<ArrowLeft size={20} />} />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-32 bg-stone-50/50 rounded-[3rem] border-2 border-dashed border-stone-200">
                <PackageSearch size={48} className="mx-auto mb-8 text-stone-200" />
                <h3 className="text-2xl font-black text-emerald-950 mb-4 tracking-tight">لا توجد مقتنيات مطابقة</h3>
                <p className="text-stone-400 text-sm font-medium mb-10 max-w-xs mx-auto leading-relaxed">
                  {selectedStore 
                    ? `عذراً، متجر ${selectedStore.name} لا يعرض مقتنيات ضمن هذه الفئة حالياً.` 
                    : "لم نعثر على أي مقتنيات تطابق معايير البحث الحالية في المعرض."}
                </p>
                <button 
                  onClick={() => router.push('/products')} 
                  className="px-10 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl"
                >
                  العودة للمعرض الشامل
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LayoutButton({ active, onClick, icon }: any) {
  return (
    <button onClick={onClick} className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center ${active ? 'bg-white text-emerald-600 shadow-md scale-110' : 'text-stone-300 hover:text-stone-600'}`}>
      {icon}
    </button>
  );
}

function PaginationBtn({ onClick, disabled, icon }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${disabled ? 'opacity-10 bg-stone-50' : 'bg-white border border-stone-100 hover:bg-emerald-950 hover:text-white shadow-sm'}`}>
      {icon}
    </button>
  );
}
