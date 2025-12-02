'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { ShoppingBag, Star, Truck, Phone, Clock, TrendingUp, ChevronDown } from 'lucide-react';
import Image from 'next/image'
export default function Home() {
  // -----------------------------
  //      بانر الصور المتغيرة
  // -----------------------------
  const images = [
    "/images/1.png",
    "/images/5.png",
    "/images/2.png",
    "/images/33.png",
    "/images/6.png",
    
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, 4000); // نصف ثانية
    return () => clearInterval(interval);
  }, [images.length]); // images موجودة الآن قبل useEffect

  // -----------------------------
  //   باقي حالة البيانات
  // -----------------------------
  const [data, setData] = useState({
    products: [] as Product[],
    categories: [] as Category[],
    newProducts: [] as Product[],
    bestSellers: [] as Product[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, newRes, bestRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories'),
          api.get('/products?sort=new'),
          api.get('/products?sort=best_selling'),
        ]);

        setData({
          products: Array.isArray(productsRes.data) ? productsRes.data : [],
          categories: Array.isArray(categoriesRes.data) ? categoriesRes.data : [],
          newProducts: Array.isArray(newRes.data) ? newRes.data : [],
          bestSellers: Array.isArray(bestRes.data) ? bestRes.data : [],
        });
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <p className="text-center text-2xl mt-20">جاري التحميل...</p>;

  const { categories, newProducts, bestSellers } = data;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ------------------------- */}
      {/*         الهيدر            */}
      {/* ------------------------- */}
      <header className="bg-gray-900 text-white">
        <div className="container mx-auto flex justify-start items-center py-4">

          <nav className="flex items-center space-x-6">

          <div className="relative group">
  {/* زر الفئات */}
  <button className="flex items-center space-x-1 pl-4 text-white hover:text-yellow-400">
    الفئات <ChevronDown size={16} />
  </button>

  {/* Dropdown */}
  <div className="
    absolute top-full left-0 right-0 mt-2 w-56
    bg-gray-900 border border-gray-700 rounded-xl shadow-xl
    opacity-0 invisible group-hover:opacity-100 group-hover:visible
    transition-all duration-200 z-50
  ">
    {categories.map(cat => (
      <div key={cat._id} className="relative group/subcat">

        {/* الفئة الرئيسية */}
        <Link
          href={`/categories/${cat.name}`}
          className="block px-4 py-2 text-white hover:bg-gray-700 rounded"
        >
          {cat.name}
        </Link>

        {/* الفئات الفرعية */}
        {cat.subcategories?.length > 0 && (
          <div className="
            absolute top-0 right-full ml-1 w-56
            bg-gray-800 border border-gray-700 rounded-xl shadow-xl
            opacity-0 invisible group-hover/subcat:opacity-100 group-hover/subcat:visible
            transition-all duration-200 z-50
          ">
            {cat.subcategories.map((sub, i) => (
              <Link
                key={i}
                href={`/categories/${cat.name}/${sub}`}
                className="block px-4 py-2 text-sm text-white hover:bg-gray-700 rounded"
              >
                {sub}
              </Link>
            ))}
          </div>
        )}

      </div>
    ))}
  </div>
</div>



            <Link href="/products" className="hover:text-yellow-400">المنتجات</Link>
            <Link href="/contact" className="hover:text-yellow-400">اتصل بنا</Link>

          </nav>
        </div>
      </header>

      {/* ------------------------- */}
      {/*        البانر الرئيسي     */}
      {/* ------------------------- */}
      <section className="relative h-96 w-full overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Banner ${index}`}
          fill
          unoptimized={true} // يسمح بعرض الصور من أي دومين
          style={{ objectFit: 'cover', objectPosition: 'center', opacity: index === currentIndex ? 1 : 0, transition: 'opacity 0.5s ease-in-out' }}
        />
      ))}
    </section>


      {/* ------------------------- */}
      {/*       الفئات الرئيسية     */}
      {/* ------------------------- */}
      <section className="py-12 bg-white">
  <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
    {categories.map((cat) => (
      <div
        key={cat._id}
        className="bg-white p-4 rounded-lg shadow hover:shadow-xl transition text-center border"
      >
        {/* صورة الفئة */}
        <div className="w-full h-32 relative mb-4">
          <Image
            src={cat.imageUrl || "/images/category-placeholder.png"}
            alt={cat.name}
            fill
            className="object-cover rounded-md"
            unoptimized
          />
        </div>

        {/* اسم الفئة */}
        <h3 className="text-xl font-semibold">{cat.name}</h3>

        {/* روابط الفئات الفرعية */}
        <div className="mt-3">
          {cat.subcategories?.slice(0, 2).map((sub) => (
            <Link
              key={sub}
              href={`/categories/${cat.slug ?? cat.name}/${sub}`}
              className="block text-sm hover:text-green-600"
            >
              {sub}
            </Link>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>



      {/* ------------------------- */}
      {/*      المنتجات الجديدة     */}
      {/* ------------------------- */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">

          <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center text-gray-800">
            <Clock className="mr-2" /> المنتجات الجديدة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {newProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* ------------------------- */}
      {/*       الأكثر مبيعاً       */}
      {/* ------------------------- */}
      <section className="py-12 bg-white">
        <div className="container mx-auto">

          <h2 className="text-4xl font-bold text-center mb-8 flex items-center justify-center text-gray-800">
            <TrendingUp className="mr-2" /> الأكثر مبيعاً
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* ------------------------- */}
      {/*     عروض خاصة (Banner)    */}
      {/* ------------------------- */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto text-center">

          <h2 className="text-4xl font-bold mb-8">عروض خاصة</h2>

          <div className="bg-white text-black p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-semibold mb-4">خصم 50% على المنتجات المحلية!</h3>
            <p className="text-xl mb-6">عرض محدود الوقت</p>
            <Link
              href="/products"
              className="bg-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              تسوق الآن
            </Link>
          </div>

        </div>
      </section>

      {/* ------------------------- */}
      {/*          الميزات          */}
      {/* ------------------------- */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center">

          <Feature icon={<ShoppingBag size={60} className="text-yellow-400" />} title="تسوق سهل" desc="تصفح بسهولة" />
          <Feature icon={<Truck size={60} className="text-blue-500" />} title="توصيل سريع" desc="في الرقة" />
          <Feature icon={<Star size={60} className="text-green-500" />} title="جودة مضمونة" desc="منتجات أصلية" />
          <Feature icon={<Phone size={60} className="text-blue-500" />} title="دعم فني" desc="24/7" />

        </div>
      </section>

      {/* ------------------------- */}
      {/*          الفوتر           */}
      {/* ------------------------- */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

          <div>
            <h3 className="text-xl font-semibold mb-4">سوق الرقة</h3>
            <p>أفضل السوق الإلكتروني في الرقة</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">روابط سريعة</h3>
            <ul>
              <li><Link href="/categories" className="hover:text-yellow-400">الفئات</Link></li>
              <li><Link href="/products" className="hover:text-yellow-400">المنتجات</Link></li>
              <li><Link href="/contact" className="hover:text-yellow-400">اتصل بنا</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">الدعم</h3>
            <p>هاتف: 0930904315</p>
            <p>info@raqamarket.com</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">تابعنا</h3>
            <p>فيسبوك – إنستغرام – تويتر</p>
          </div>

        </div>

        <div className="text-center mt-8">
          <p>&copy; 2023 سوق الرقة - جميع الحقوق محفوظة</p>
        </div>

      </footer>

    </div>
  );
}

/* ------------------------- */
/*       Component صغير      */
/* ------------------------- */
function Feature({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center">
      {icon}
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p>{desc}</p>
    </div>
  );
}
