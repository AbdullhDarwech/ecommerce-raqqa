import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow hover:shadow-lg transition transform hover:scale-105">
      <Image src={product.images[0]} alt={product.name} width={300} height={300} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-syrazo-green font-bold mt-2">
        شراء: ${product.pricePurchase} | تأجير: ${product.priceRental}
      </p>
      {product.isBestSeller && <span className="bg-syrazo-yellow text-black px-2 py-1 rounded text-sm">الأكثر مبيعاً</span>}
      <div className="flex justify-between mt-4">
        <Link href={`/products/${product._id}`} className="bg-syrazo-blue text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          عرض التفاصيل
        </Link>
        {showAddToCart && (
          <button className="bg-syrazo-green text-white px-4 py-2 rounded hover:bg-green-700 transition">
            <ShoppingCart size={16} />
          </button>
        )}
        <button className="text-red-500">
          <Heart size={16} />
        </button>
      </div>
    </div>
  );
}