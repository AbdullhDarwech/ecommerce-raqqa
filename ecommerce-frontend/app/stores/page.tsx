'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Star, ArrowLeft, Store as StoreIcon } from 'lucide-react';
import api from '@/lib/api';
import { Store } from '@/lib/types';
import { motion } from 'framer-motion';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores');
        // Filter only active stores for public view if logic dictates
        const activeStores = Array.isArray(res.data) 
          ? res.data.filter((s: Store) => s.isActive) 
          : [];
        setStores(activeStores);
      } catch (error) {
        console.error("Failed to fetch stores", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-3xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">شركاؤنا المميزون</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          تصفح قائمة المتاجر المحلية المعتمدة في سوق الرقة وتسوق من منتجاتهم مباشرة.
        </p>
      </div>

      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <motion.div
              key={store._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col h-full"
            >
              {/* Cover Image */}
              <div className="relative h-40 bg-gray-200">
                <Image
                  src={store.coverImage || '/placeholder-wide.png'}
                  alt={store.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Logo & Content */}
              <div className="px-6 pb-6 flex-1 flex flex-col relative">
                {/* Logo Avatar */}
                <div className="relative -mt-10 mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg inline-block overflow-hidden">
                     <Image
                      src={store.logo || '/placeholder.png'}
                      alt={store.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover rounded-xl"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="flex justify-between items-start mb-2">
                   <div>
                      <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {store.name}
                      </h2>
                      <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 w-fit">
                         <Star size={12} className="fill-current" />
                         <span>متجر موثوق</span>
                      </div>
                   </div>
                </div>

                {/* Info */}
                <div className="space-y-2 mt-4 text-sm text-gray-600 flex-1">
                  {store.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400 shrink-0" />
                      <span className="line-clamp-1">{store.address}</span>
                    </div>
                  )}
                  {store.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400 shrink-0" />
                      <span dir="ltr">{store.phone}</span>
                    </div>
                  )}
                  {store.description && store.description.length > 0 && (
                     <p className="mt-3 text-gray-500 text-sm line-clamp-2 leading-relaxed">
                        {store.description[0]}
                     </p>
                  )}
                </div>

                {/* Action */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/products?store=${store._id}`} // Assuming you filter products by store later
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-xl hover:bg-emerald-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-emerald-500/20"
                  >
                    <StoreIcon size={18} />
                    زيارة المتجر
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <StoreIcon size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">لا توجد متاجر حالياً</h3>
          <p className="text-gray-500 mt-2">نعمل على إضافة شركاء جدد قريباً.</p>
        </div>
      )}
    </div>
  );
}