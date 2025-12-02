import Image from 'next/image';
import ProductDetails from '@/components/ProductDetails';
import api from '@/lib/api';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { data: product } = await api.get(`/products/${params.id}`);

  return (
    <div className="container mx-auto p-4">
      <ProductDetails product={product} />
    </div>
  );
}