'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { 
  ShoppingBag, 
  Star, 
  Truck, 
  Phone, 
  Clock, 
  TrendingUp, 
  ArrowLeft
} from 'lucide-react';

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Internal Imports
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';
import { Product, Category } from '@/lib/types';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  // -----------------------------
  //      State & Data
  // -----------------------------
  const [data, setData] = useState({
    products: [] as Product[],
    categories: [] as Category[],
    newProducts: [] as Product[],
    bestSellers: [] as Product[],
  });
  const [loading, setLoading] = useState(true);

  // Hero Slider Images
  const images = [
    "/images/31.jpg",
    "/images/42.jpg",
    "/images/52.jpg",
    "/images/62.jpg",
  ];
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // -----------------------------
  //      Effects
  // -----------------------------
  
  // Hero Auto-Play Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Data Fetching
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
          products: Array.isArray(productsRes.data?.data) ? productsRes.data?.data : [],
          categories: Array.isArray(categoriesRes.data) ? categoriesRes.data : [],
          newProducts: Array.isArray(newRes.data?.data) ? newRes.data?.data : [],
          bestSellers: Array.isArray(bestRes.data?.data) ? bestRes.data?.data: [],
        });
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -----------------------------
  //      Loading State (Skeleton)
  // -----------------------------
  if (loading) {
    return <LoadingSkeleton />;
  }

  const { categories, newProducts, bestSellers } = data;

  return (
    <main className="min-h-screen bg-gray-50 font-sans" dir="rtl">
      
      {/* ------------------------- */}
      {/*       Hero Section        */}
      {/* ------------------------- */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-gray-900 rounded-b-3xl md:rounded-b-[3rem] shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentHeroIndex]}
              alt={`Banner ${currentHeroIndex}`}
              fill
              className="object-cover object-center opacity-60"
              priority
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center justify-center text-center z-10 px-4">
          <div className="max-w-3xl space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight"
            >
              اكتشف عالم التسوق <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                بلمسة عصرية
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-200"
            >
              أفضل المنتجات بأفضل الأسعار، تصلك أينما كنت.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex justify-center gap-4 pt-4"
            >
              <Link 
                href="/products" 
                className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-emerald-500/30 flex items-center gap-2 overflow-hidden"
              >
                <span className="relative z-10">تسوق الآن</span>
                <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Custom Pagination Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 space-x-reverse z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentHeroIndex ? 'w-8 bg-emerald-500' : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ------------------------- */}
      {/*      Categories Grid      */}
      {/* ------------------------- */}
      <section className="py-16 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-bold text-gray-800">تصفح الفئات</h2>
            <Link href="/categories" className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-medium transition-colors">
              عرض الكل <ArrowLeft size={16} />
            </Link>
          </div>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="pb-10 !px-2"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat._id}>
                <Link href={`/products?category=${cat.name}`} className="group block">
                  <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-100/50 hover:-translate-y-2 h-full">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white shadow-sm p-2 group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors text-center">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* ------------------------- */}
      {/*      New Arrivals         */}
      {/* ------------------------- */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="وصل حديثاً" 
            subtitle="أحدث الصيحات المضافة لمتجرنا"
            icon={<Clock className="text-emerald-500" />} 
          />
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              breakpoints={{
                500: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              className="!pb-12 product-swiper"
            >
              {newProducts.slice(0, 10).map((product) => (
                <SwiperSlide key={product._id} className="pt-4 px-1">
                   {/* Wrapping ProductCard to ensure hover effects don't get cut off */}
                  <div className="h-full transform transition-all hover:z-10">
                    <ProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* ------------------------- */}
      {/*      Special Offer Banner */}
      {/* ------------------------- */}
      <section className="py-20 bg-gradient-to-br from-emerald-800 to-gray-900 text-white relative overflow-hidden my-8 rounded-3xl mx-4 shadow-2xl">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 text-center lg:text-right"
            >
              <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-4">
                عرض لفترة محدودة
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                خصم يصل إلى <span className="text-emerald-400">50%</span> <br />
                على المنتجات المحلية
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
                تسوق الآن واحصل على أفضل العروض الحصرية. الجودة العالية والأسعار المنافسة في مكان واحد.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/40 text-lg"
                >
                  تصفح العروض
                </Link>
                <Link
                  href="/contact"
                  className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all"
                >
                  اتصل بنا
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                 {/* Decorative graphic */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-gray-800 to-gray-700 rounded-3xl rotate-3 opacity-50"></div>
                 <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl -rotate-3 flex items-center justify-center p-8">
                    <div className="text-center">
                        <ShoppingBag size={80} className="mx-auto text-emerald-400 mb-4" />
                        <h3 className="text-2xl font-bold">باقة التوفير</h3>
                        <p className="text-gray-400 mt-2">كل ما تحتاجه</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------- */}
      {/*      Best Sellers         */}
      {/* ------------------------- */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="الأكثر مبيعاً" 
            subtitle="المنتجات التي أحبها عملاؤنا"
            icon={<TrendingUp className="text-rose-500" />} 
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1}
              navigation
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                500: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              className="!pb-12 product-swiper"
            >
              {bestSellers.slice(0, 10).map((product) => (
                <SwiperSlide key={product._id} className="pt-4 px-1">
                  <div className="h-full transform transition-all hover:z-10">
                    <ProductCard product={product} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>

      {/* ------------------------- */}
      {/*        Features           */}
      {/* ------------------------- */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <FeatureCard 
              icon={<ShoppingBag size={32} className="text-emerald-600" />} 
              title="تجربة تسوق سهلة" 
              desc="واجهة بسيطة وسريعة لتجربة ممتعة"
              delay={0.1}
            />
            <FeatureCard 
              icon={<Truck size={32} className="text-blue-600" />} 
              title="شحن سريع وموثوق" 
              desc="توصيل آمن إلى باب منزلك في الرقة"
              delay={0.2}
            />
            <FeatureCard 
              icon={<Star size={32} className="text-amber-500" />} 
              title="جودة مضمونة" 
              desc="منتجات أصلية 100% تم فحصها بعناية"
              delay={0.3}
            />
            <FeatureCard 
              icon={<Phone size={32} className="text-purple-600" />} 
              title="دعم فني متواصل" 
              desc="فريقنا جاهز لخدمتك على مدار الساعة"
              delay={0.4}
            />
          </motion.div>
        </div>
      </section>

      {/* ------------------------- */}
      {/*    Floating WhatsApp      */}
      {/* ------------------------- */}
      <Link
        href="https://wa.me/0930904315"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-6 bottom-6 z-50 group"
      >
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:opacity-40 duration-1000" />
        <div className="relative w-16 h-16 bg-gradient-to-tr from-green-600 to-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-green-500/50 hover:scale-110 transition-all duration-300">
          <Phone size={30} className="text-white fill-current" />
          <span className="absolute right-full mr-4 bg-gray-800 text-white text-sm py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            تواصل معنا
          </span>
        </div>
      </Link>

    </main>
  );
}

// ------------------------------------
// Sub-Components
// ------------------------------------

function SectionHeader({ title, subtitle, icon }: { title: string, subtitle?: string, icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center mb-12 text-center">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="p-2 bg-gray-100 rounded-full">{icon}</span>}
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-500 max-w-2xl">{subtitle}</p>}
      <div className="w-24 h-1 bg-emerald-500 mt-4 rounded-full" />
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center group"
    >
      <div className="w-16 h-16 mx-auto bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-8 animate-pulse">
      <div className="h-[70vh] bg-gray-200 rounded-3xl w-full" />
      <div className="container mx-auto grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
      </div>
      <div className="container mx-auto space-y-4">
        <div className="h-10 w-48 bg-gray-200 rounded mx-auto" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );
}