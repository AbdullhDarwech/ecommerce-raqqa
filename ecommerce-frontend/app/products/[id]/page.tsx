
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
// Using next/router as a fallback
// import { useRouter } from 'next/router';
import api from '@/lib/api';
import { Product } from '@/lib/types';
import ProductDetails from '@/components/ProductDetails';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';

export default function ProductPage() {
  const routeParams = useParams();
  const id = routeParams.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: productData } = await api.get(`/products/${id}`);
        setProduct(productData);

        if (productData.category) {
            const catName = typeof productData.category === 'object' ? productData.category.name : productData.category;
            const { data: related } = await api.get(`/products?category=${catName}&limit=4`);
            setRelatedProducts(related.data?.filter((p: Product) => p._id !== id) || []);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
          </div>
      );
  }

  if (!product) {
      return (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold text-gray-800">المنتج غير موجود</h2>
              <p className="text-gray-500 mb-4">ربما تم حذف هذا المنتج أو الرابط غير صحيح.</p>
          </div>
      );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />

      {relatedProducts.length > 0 && (
        <div className="mt-20 border-t pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">منتجات مشابهة قد تعجبك</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                    <div key={p._id} className="h-96">
                        <ProductCard product={p} />
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}