'use client';
import Image from 'next/image';
import api from '@/lib/api';
import { CartItem as CartItemType } from '@/lib/types';

export default function CartItem({ item }: { item: CartItemType }) {
  const updateQuantity = async (quantity: number) => {
    await api.put('/cart/update', { items: [{ ...item, quantity }] });
  };

  const removeItem = async () => {
    await api.delete('/cart/remove', { data: { productId: item.product._id, orderType: item.orderType } });
  };

  return (
    <div className="flex items-center border p-4 rounded">
      <Image src={item.product.images[0]} alt={item.product.name} width={100} height={100} />
      <div className="ml-4 flex-1">
        <h3>{item.product.name}</h3>
        <p>السعر: ${item.product.pricePurchase}</p>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateQuantity(Number(e.target.value))}
          className="border p-1 w-16"
        />
      </div>
      <button onClick={removeItem} className="text-red-500">إزالة</button>
    </div>
  );
}