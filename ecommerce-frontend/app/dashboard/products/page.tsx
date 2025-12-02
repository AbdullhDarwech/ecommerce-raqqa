'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import SearchFilter from '@/components/SearchFilter';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function DashboardProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get('/products', { params: filters }).then((res) => setProducts(Array.isArray(res.data) ? res.data : []));
  }, [filters]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-raqqa-river">المنتجات</h1>
      <SearchFilter onFilter={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}