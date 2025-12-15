'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import SearchFilter from '@/components/SearchFilter';
import CategoriesSidebar from '@/components/CategoriesSidebar';
import api from '@/lib/api';
import { Product } from '@/lib/types';
import { List, LayoutGrid } from 'lucide-react';

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ---------------------------------------------
  // 1️⃣ قراءة الفلاتر من URL
  // ---------------------------------------------
  useEffect(() => {
    const queryFilters: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      queryFilters[key] = value;
    });

    setFilters(queryFilters);
    setPage(Number(queryFilters.page || 1));

  }, [searchParams.toString()]);


  // ---------------------------------------------
  // 2️⃣ تحديث URL عند تغيير الفلاتر
  // ---------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(filters);

    params.set("page", page.toString());

    router.push(`/products?${params.toString()}`, { scroll: false });

  }, [filters, page]);


  // ---------------------------------------------
  // 3️⃣ جلب المنتجات عند تغيير الفلاتر أو الصفحة
  // ---------------------------------------------
  useEffect(() => {
    api
      .get("/products", { params: { ...filters, page } })
      .then((res) => {
        setProducts(res.data.data);
        setTotalPages(res.data.totalPages);
      });

  }, [filters, page]);


  // ---------------------------------------------
  // 4️⃣ تغيير فلتر من Sidebar أو SearchFilter
  // ---------------------------------------------
  const handleFilter = (newFilter: Record<string, string>) => {
    setFilters((prev) => ({ ...prev, ...newFilter, page: "1" }));
    setPage(1);
  };


  return (
    <div className="container mx-auto p-4">

<div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border">
  <h1 className="text-3xl font-bold text-gray-800">المنتجات</h1>

  <div className="flex gap-4">
    <LayoutGrid
      className={`cursor-pointer hover:text-blue-500 transition ${
        layout === 'grid' && 'text-blue-600'
      }`}
      onClick={() => setLayout('grid')}
      size={28}
    />

    <List
      className={`cursor-pointer hover:text-blue-500 transition ${
        layout === 'list' && 'text-blue-600'
      }`}
      onClick={() => setLayout('list')}
      size={28}
    />
  </div>
</div>


      <div className="flex gap-6">

        {/* Sidebar */}
        <CategoriesSidebar selectedCategory={filters.category} onSelect={handleFilter} />

        <div className="flex-1">
          
          {/* Search */}
          <SearchFilter onFilter={handleFilter} />

          {/* Products Grid */}
          <div
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'
                : 'flex flex-col gap-4 mt-4'
            }
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} layout={layout} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              السابق
            </button>

            <span className="px-4 py-2 font-bold">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              التالي
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
