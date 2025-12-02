'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    api.get('/users/favorites').then((res) => setFavorites(res.data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">المفضلة</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {favorites.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}