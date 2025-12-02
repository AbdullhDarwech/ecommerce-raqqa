'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function DashboardSubcategory({ params }: { params: { id: string; sub: string } }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products?category=${params.id}&subcategory=${params.sub}`);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [params.id, params.sub]);

  if (loading) return <p className="text-center text-2xl mt-20">جاري التحميل...</p>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-raqqa-river">فئة: {params.id} - {params.sub}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}