'use client';
import { useState } from 'react';
import Image from 'next/image';
import api from '@/lib/api';
import { Product } from '@/lib/types';

export default function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState<'purchase' | 'rental'>('purchase');

  const addToCart = async () => {
    await api.post('/cart/add', { productId: product._id, quantity, orderType });
    alert('تم إضافة المنتج إلى السلة');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        {product.images.map((img: string, i: number) => (
          <Image key={i} src={img} alt={product.name} width={400} height={400} className="w-full mb-4" />
        ))}
      </div>
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-lg mt-2">{product.description}</p>
        <p className="text-raqqa-green mt-4">
          شراء: ${product.pricePurchase} | تأجير: ${product.priceRental}
        </p>
        <div className="mt-4">
          <label>الكمية:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border p-2 ml-2"
          />
        </div>
        <div className="mt-4">
          <label>نوع الطلب:</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value as 'purchase' | 'rental')} className="border p-2 ml-2">
            <option value="purchase">شراء</option>
            <option value="rental">تأجير</option>
          </select>
        </div>
        <button onClick={addToCart} className="bg-raqqa-green text-white px-6 py-2 rounded mt-4">
          إضافة إلى السلة
        </button>
        <button className="bg-raqqa-river text-white px-6 py-2 rounded mt-2 ml-2">
          إضافة إلى المفضلة
        </button>
        <div className="mt-8">
          <h3 className="text-xl font-semibold">المراجعات</h3>
          {product.reviews?.map((review) => (
            <div key={review._id} className="border-b py-2">
              <p>التقييم: {review.rating}/5</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}