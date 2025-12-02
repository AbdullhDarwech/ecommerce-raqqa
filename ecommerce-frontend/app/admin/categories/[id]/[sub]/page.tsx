'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function SubcategoryPage({ params }: { params: { id: string; sub: string } }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get(`/products?category=${params.id}&subcategory=${params.sub}`).then((res) => setProducts(Array.isArray(res.data) ? res.data : []));
  }, [params.id, params.sub]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">فئة: {params.id} - {params.sub}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}