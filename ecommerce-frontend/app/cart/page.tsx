'use client';
import { useEffect, useState } from 'react';
import CartItem from '@/components/CartItem';
import api from '@/lib/api';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    api.get('/cart').then((res) => setCart(res.data));
  }, []);

  const checkout = async () => {
    await api.post('/orders', { deliveryAddress: 'Raqqa Address' });
    alert('تم إنشاء الطلب');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">السلة</h1>
      <div className="space-y-4">
        {cart.items.map((item: any) => (
          <CartItem key={item.product._id} item={item} />
        ))}
      </div>
      <button onClick={checkout} className="bg-raqqa-green text-white px-6 py-2 rounded mt-4">
        إتمام الشراء
      </button>
    </div>
  );
}