
'use client';

import { useState, useEffect, Suspense, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import SearchFilter from '@/components/SearchFilter';
import CategoriesSidebar from '@/components/CategoriesSidebar';
import api from '@/lib/api';
import { Product, Category, Store } from '@/lib/types';
import Image from 'next/image';
import { 
  LayoutGrid, List, PackageSearch, X, Sparkles, 
  ArrowLeft, ArrowRight, ChevronDown, Globe, ShieldCheck,
  Hash, Filter, SlidersHorizontal, Search, Loader2,
  ShoppingBag, Star, Zap, Crown, ChevronUp, ArrowDown, ArrowUp
} from 'lucide-react';
import ShieldText from '@/components/ShieldText';

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
          <div className="absolute inset-0 border-[3px] border-emerald-500/10 rounded-full" />
          <div className="absolute inset-0 border-[3px] border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-4 border-2 border-amber-500/30 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="font-bold text-emerald-900/40 text-[10px] uppercase tracking-[0.4em] animate-pulse">جاري تحميل المجموعات</span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mobileFilterRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [shouldFocusSearch, setShouldFocusSearch] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasScrolledToTop, setHasScrolledToTop] = useState(false);

  // Pull to Refresh State
  const [touchStart, setTouchStart] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    setShowMobileFilters(false);
  }, [pathname]);

  useEffect(() => {
    const focus = searchParams.get('focus');
    if (focus === 'search' || focus === 'filter') {
      setShowMobileFilters(true);
      setShouldFocusSearch(focus === 'search');
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showMobileFilters]);

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

  const fetchProducts = useCallback(async (append = false) => {
    if (append) setIsLoadingMore(true); else setIsLoading(true);
    
    try {
      const params = Object.fromEntries(searchParams.entries());
      const res = await api.get("/products", { params });
      
      if (append) {
        setProducts(prev => [...prev, ...(res.data.data || [])]);
      } else {
        setProducts(res.data.data || []);
      }
      
      setTotalPages(res.data.totalPages || 1);
      setTotalItems(res.data.totalItems || 0);

      if (params.store) fetchStoreInfo(params.store); else setSelectedStore(null);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      if (!append && typeof window !== 'undefined' && !searchParams.get('focus')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setHasScrolledToTop(true);
      }
    }
  }, [searchParams, fetchStoreInfo]);

  useEffect(() => {
    const page = searchParams.get('page');
    // If page is > 1 and it's not the initial load, we treat it as "append"
    const shouldAppend = Number(page) > 1 && !isFirstLoad.current;
    fetchProducts(shouldAppend);
    isFirstLoad.current = false;
  }, [searchParams]);

  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString());
    current.delete('focus');
    current.delete('t'); 
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '') current.delete(key); else current.set(key, value);
    });

    if ('category' in newParams) current.delete('subcategory');
    if (!newParams.page) current.set("page", "1");

    setShowMobileFilters(false);
    router.push(`/products?${current.toString()}`, { scroll: false });
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      updateQueryParams({ page: (currentPage + 1).toString() });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart !== 0 && window.scrollY === 0) {
      const pullDistance = e.targetTouches[0].clientY - touchStart;
      if (pullDistance > 80) setIsPulling(true);
    }
  };

  const handleTouchEnd = () => {
    if (isPulling) {
      fetchProducts(false);
      setTimeout(() => setIsPulling(false), 1000);
    }
    setTouchStart(0);
  };

  const activeCategoryId = searchParams.get('category');
  const activeSubcategory = searchParams.get('subcategory');
  const currentPage = Number(searchParams.get('page')) || 1;

  const activeCategory = useMemo(() => {
    return categories.find(c => c._id === activeCategoryId);
  }, [categories, activeCategoryId]);

  return (
    <LayoutGroup>
      <div 
        className="bg-white min-h-screen pb-32 lg:pb-20 selection:bg-emerald-600 selection:text-white relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence>
          {isPulling && (
            <MotionDiv initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
              <div className="bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full shadow-2xl border border-emerald-100 flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                <span className="text-xs font-bold text-emerald-800">تحديث...</span>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>

        {/* 1. CINEMATIC HEADER */}
        <section className="relative pt-28 pb-16 md:pt-44 md:pb-28 bg-emerald-950 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.1),transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center">
              <AnimatePresence mode="wait">
                {selectedStore ? (
                  <MotionDiv key="store" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6">
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-1.5 shadow-2xl">
                      <Image src={selectedStore.logo || '/placeholder.png'} alt={selectedStore.name} fill className="object-cover rounded-2xl" unoptimized />
                      <div className="absolute -bottom-2 -right-2 bg-amber-400 text-emerald-950 p-1.5 rounded-xl border-2 border-white"><ShieldCheck size={18} /></div>
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-tight">
                      معرض <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">{selectedStore.name}</span>
                    </h1>
                    <button onClick={() => updateQueryParams({ store: null })} className="flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all shadow-2xl"><Globe size={14} /> العودة للمعرّض العام</button>
                  </MotionDiv>
                ) : (
                  <MotionDiv key="general" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-amber-400 text-[9px] font-black tracking-[0.4em] uppercase mb-8 shadow-2xl">
                      <Sparkles size={12} /> The Elite Collection
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-tight mb-8">
                      {activeCategoryId ? (
                        <>مجموعة <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200"><ShieldText text={activeCategory?.name || ''} /></span></>
                      ) : (
                        <>المعرض <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200">السيادي</span></>
                      )}
                    </h1>
                    <AnimatePresence>
                      {activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
                        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap justify-center gap-2 mt-4 max-w-4xl px-4">
                          <button onClick={() => updateQueryParams({ subcategory: null })} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${!activeSubcategory ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl' : 'bg-white/5 text-emerald-100/60 border-white/10 hover:bg-white/10'}`}>الكل</button>
                          {activeCategory.subcategories.map((sub) => (
                            <button key={sub} onClick={() => updateQueryParams({ subcategory: sub })} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeSubcategory === sub ? 'bg-amber-400 text-emerald-950 border-amber-300 shadow-xl' : 'bg-white/5 text-emerald-100/60 border-white/10 hover:bg-white/10'}`}>
                              <span className="flex items-center gap-2"><Hash size={12} className={activeSubcategory === sub ? 'text-emerald-900' : 'text-emerald-500/40'} />{sub}</span>
                            </button>
                          ))}
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 2. PC FILTER STRIP */}
        <div className="sticky top-[72px] md:top-[88px] z-40 bg-white/90 backdrop-blur-2xl border-b border-emerald-50 hidden lg:block shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-stone-50 p-1.5 rounded-xl border border-stone-100">
                  <LayoutButton active={layout === 'grid'} onClick={() => setLayout('grid')} icon={<LayoutGrid size={16} />} />
                  <LayoutButton active={layout === 'list'} onClick={() => setLayout('list')} icon={<List size={16} />} />
                </div>
                <div className="text-[9px] font-black text-stone-400 uppercase tracking-widest">عرض <span className="text-emerald-950">{totalItems.toLocaleString()}</span> مقتنى</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select onChange={(e) => updateQueryParams({ sort: e.currentTarget.value })} value={searchParams.get('sort') || ''} className="appearance-none bg-stone-50 border border-stone-100 rounded-xl px-10 py-2.5 font-bold text-[11px] text-emerald-950 outline-none cursor-pointer pr-12 shadow-inner">
                    <option value="">المضاف حديثاً</option>
                    <option value="price_asc">السعر: الأقل أولاً</option>
                    <option value="price_desc">السعر: الأعلى أولاً</option>
                  </select>
                  <ChevronDown size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. MOBILE FILTER DRAWER */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMobileFilters(false)} className="fixed inset-0 bg-emerald-950/70 backdrop-blur-md z-[100] lg:hidden" />
              <motion.div ref={mobileFilterRef} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[101] lg:hidden shadow-3xl flex flex-col" >
                <div className="p-8 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="text-xl font-black text-emerald-950 tracking-tight">بروتوكول التصفية</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                  <section className="space-y-6">
                    <div className="flex items-center gap-3"><div className="w-1 h-4 bg-emerald-600 rounded-full" /><h3 className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.3em]">البحث والفلترة</h3></div>
                    <SearchFilter autoFocus={shouldFocusSearch} onFilter={(f) => updateQueryParams(f)} />
                  </section>
                  <section className="space-y-6">
                    <div className="flex items-center gap-3"><div className="w-1 h-4 bg-amber-500 rounded-full" /><h3 className="text-[10px] font-black text-emerald-950 uppercase tracking-[0.3em]">المجموعات</h3></div>
                    <CategoriesSidebar selectedCategory={activeCategoryId || ''} onSelect={(f) => updateQueryParams(f)} />
                  </section>
                </div>
                <div className="p-8 bg-stone-50 border-t border-stone-100"><button onClick={() => setShowMobileFilters(false)} className="w-full py-5 bg-emerald-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">تطبيق التعديلات</button></div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 4. MAIN CONTENT */}
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-16">
          <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
            <aside className="hidden lg:block w-72 shrink-0 space-y-12">
              <SearchFilter onFilter={(f) => updateQueryParams(f)} />
              <CategoriesSidebar selectedCategory={activeCategoryId || ''} onSelect={(f) => updateQueryParams(f)} />
            </aside>

            <div className="flex-1 min-w-0">
              {/* Mobile Quick Controls */}
              <div className="lg:hidden flex items-center justify-between mb-8 bg-white/80 backdrop-blur-xl p-4 rounded-3xl border border-stone-100 shadow-sm sticky top-20 z-30">
                <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  <SlidersHorizontal size={14} /> تخصيص البحث
                </button>
                <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl">
                  <LayoutButton active={layout === 'grid'} onClick={() => setLayout('grid')} icon={<LayoutGrid size={14} />} />
                  <LayoutButton active={layout === 'list'} onClick={() => setLayout('list')} icon={<List size={14} />} />
                </div>
              </div>

              {isLoading && !isLoadingMore ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-[3/4] bg-stone-50 rounded-[2rem] md:rounded-[2.5rem] animate-pulse border border-emerald-50/50" />)}
                </div>
              ) : products.length > 0 ? (
                <div className="space-y-16">
                  <MotionDiv layout className={layout === 'grid' ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8' : 'flex flex-col gap-6'}>
                    <AnimatePresence mode="popLayout">
                      {products.map((product, idx) => (
                        <MotionDiv key={product._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.03 }}>
                          <ProductCard product={product} layout={layout} />
                        </MotionDiv>
                      ))}
                    </AnimatePresence>
                  </MotionDiv>

                  {isLoadingMore && (
                    <div className="flex justify-center py-10">
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                        <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.3em]">تحميل المزيد من المقتنيات...</span>
                      </div>
                    </div>
                  )}

                  {!isLoadingMore && currentPage < totalPages && (
                    <div className="flex justify-center pt-8 md:hidden">
                       <button onClick={handleLoadMore} className="w-full py-5 bg-white border-2 border-emerald-100 text-emerald-600 rounded-3xl font-black text-xs uppercase tracking-widest active:bg-emerald-50 transition-all flex items-center justify-center gap-3">تحميل المزيد <ArrowDown size={16} /></button>
                    </div>
                  )}

                  {/* Desktop Pagination */}
                  {totalPages > 1 && (
                    <div className="hidden md:flex justify-center items-center gap-3 pt-12 border-t border-emerald-50">
                      <PaginationBtn onClick={() => updateQueryParams({ page: (currentPage - 1).toString() })} disabled={currentPage === 1} icon={<ArrowRight size={20} />} />
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <button key={p} onClick={() => updateQueryParams({ page: p.toString() })} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === p ? 'bg-emerald-950 text-white shadow-xl scale-110' : 'bg-white text-stone-400 border border-stone-100 hover:bg-stone-50'}`}>{p}</button>
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
                  <button onClick={() => updateQueryParams({})} className="px-10 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] shadow-xl">العودة للمعرض الشامل</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll To Top */}
        <AnimatePresence>
          {hasScrolledToTop && (
            <motion.button initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-28 left-6 md:bottom-10 md:left-10 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl z-50 flex items-center justify-center border-2 border-white hover:bg-emerald-700 transition-all">
              <ChevronUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

function LayoutButton({ active, onClick, icon }: any) {
  return (
    <button onClick={onClick} className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center ${active ? 'bg-white text-emerald-600 shadow-md scale-110' : 'text-stone-400 hover:text-stone-600'}`}>
      {icon}
    </button>
  );
}

function PaginationBtn({ onClick, disabled, icon }: any) {
  return (
    <button onClick={onClick} disabled={disabled} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${disabled ? 'opacity-20 bg-stone-50 cursor-not-allowed' : 'bg-white border border-stone-100 hover:bg-emerald-950 hover:text-white shadow-sm'}`}>
      {icon}
    </button>
  );
}
