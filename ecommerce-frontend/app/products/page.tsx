'use client';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import SearchFilter from '@/components/SearchFilter';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get('/products', { params: filters }).then((res) => {
      setProducts(Array.isArray(res.data) ? res.data : []);
    });
  }, [filters]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">المنتجات</h1>
      <SearchFilter onFilter={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}