'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function DashboardFavorites() {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    api.get('/users/favorites').then((res) => setFavorites(Array.isArray(res.data) ? res.data : []));
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-raqqa-river">المفضلة</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}