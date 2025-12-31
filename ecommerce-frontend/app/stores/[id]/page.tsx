'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';

interface Store {
  _id: string;
  name: string;
  description: string[];
  logo?: string;
  coverImage?: string;
  address?: string;
  phone?: string;
  email?: string;
  categories?: string[];
  products?: string[];
}

export default function StorePage() {
  const params = useParams();
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    api.get(`/stores/${params.id}`)
       .then(res => setStore(res.data))
       .catch(err => console.error(err));
  }, [params.id]);

  if (!store) return <p className="text-center mt-10">جارٍ التحميل...</p>;

  return (
    <div className="container mx-auto p-4">
      {/* صورة الغلاف */}
      {store.coverImage && (
        <img
          src={store.coverImage}
          alt={store.name}
          className="w-full h-60 object-cover rounded-lg mb-6"
        />
      )}

      <div className="flex items-center mb-6">
        {/* شعار المتجر */}
        {store.logo && (
          <img
            src={store.logo}
            alt={`${store.name} logo`}
            className="w-20 h-20 object-cover rounded-full mr-4 border"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold">{store.name}</h1>
          {store.address && <p className="text-gray-500">{store.address}</p>}
          {store.phone && <p className="text-gray-500">📞 {store.phone}</p>}
          {store.email && <p className="text-gray-500">✉️ {store.email}</p>}
        </div>
      </div>

      {/* وصف المتجر */}
      <div className="space-y-2 mb-6">
        {store.description?.map((line, i) => (
          <p key={i} className="text-gray-600">{line}</p>
        ))}
      </div>

      {/* فئات المتجر */}
      {store.categories?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">فئات المتجر</h2>
          <ul className="flex flex-wrap gap-2">
            {store.categories.map((catId, i) => (
              <li
                key={i}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {catId /* لاحقًا يمكن استبداله باسم الفئة بعد جلب البيانات */}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* منتجات المتجر */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">منتجات المتجر</h2>
        {store.products?.length ? (
          <p className="text-gray-500">سيتم عرض المنتجات هنا...</p>
        ) : (
          <p className="text-gray-500">لا توجد منتجات حالياً.</p>
        )}
      </div>
    </div>
  );
}
