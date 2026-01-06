"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Star,
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  ShieldCheck,
  RefreshCw,
  CheckCircle,
  Truck,
  Settings2,
  ArrowRight,
  Share2,
  ChevronLeft,
  MessageSquare,
  User,
  Calendar,
  ThumbsUp,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const MotionDiv = motion.div as any;

export default function ProductDetails({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.[0]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "properties"
  >("description");
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    name: "",
    email: "",
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { addToCart } = useCart();

  // بيانات التقييمات الوهمية للعرض
  const sampleReviews = [
    {
      id: 1,
      name: "أحمد محمد",
      rating: 5,
      date: "2024-01-15",
      comment:
        "منتج رائع جداً وجودة استثنائية. التوصيل كان سريعاً والخدمة ممتازة.",
      likes: 24,
      verified: true,
    },
    {
      id: 2,
      name: "سارة علي",
      rating: 4,
      date: "2024-01-10",
      comment: "جيدة ولكن اللون مختلف قليلاً عن الصورة. بشكل عام منتج جيد.",
      likes: 12,
      verified: true,
    },
    {
      id: 3,
      name: "خالد عبدالله",
      rating: 5,
      date: "2024-01-05",
      comment: "أفضل منتج اشتريته هذا العام! الجودة والتغليف على أعلى مستوى.",
      likes: 42,
      verified: false,
    },
  ];

  const averageRating =
    sampleReviews.reduce((acc, review) => acc + review.rating, 0) /
    sampleReviews.length;
  const totalReviews = sampleReviews.length;

  const handleAddToCart = async () => {
    if (product.stockQuantity < 1) return;
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    addToCart(product, quantity, "purchase");
    setIsAdding(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New review:", newReview);
    alert("شكراً لتقييمك! تم إرسال التقييم بنجاح.");
    setNewReview({
      rating: 5,
      comment: "",
      name: "",
      email: "",
    });
  };

  const categoryName =
    typeof product.category === "object"
      ? product.category.name
      : "مقتنيات فاخرة";

  return (
    <div className="py-4 md:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Navigation & Breadcrumbs - Mobile Optimized */}
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <Link
          href="/products"
          className="group flex items-center gap-2 text-emerald-900/60 hover:text-emerald-600 transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
          <span className="hidden sm:inline">العودة للمعرض</span>
          <span className="sm:hidden">رجوع</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="p-2 sm:p-3 bg-stone-50 text-stone-400 hover:text-emerald-600 rounded-xl sm:rounded-2xl transition-all">
            <Share2 size={16} className="sm:size-18" />
          </button>
          <button
            className="md:hidden p-2 bg-stone-50 text-stone-400 hover:text-emerald-600 rounded-xl transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
        {/* --- 1. GALLERY SECTION - Mobile Optimized --- */}
        <div className="space-y-4 md:space-y-6">
          <MotionDiv
            layoutId={`image-${product._id}`}
            className="relative w-full aspect-square rounded-2xl md:rounded-[3rem] overflow-hidden bg-stone-50 border border-emerald-50 shadow-lg md:shadow-2xl group"
          >
            <Image
              src={activeImage || "/placeholder.png"}
              alt={product.name}
              fill
              priority
              className="object-contain p-4 md:p-8 lg:p-16 transition-transform duration-1000 group-hover:scale-110"
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`absolute top-4 left-4 md:top-8 md:left-8 p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl z-10 transition-all ${
                isFavorite
                  ? "bg-rose-500 text-white"
                  : "bg-white/90 backdrop-blur-xl text-stone-400 hover:text-rose-500"
              }`}
            >
              <Heart
                className={isFavorite ? "fill-current" : ""}
                size={14}
                className="md:size-10"
              />
            </button>

            {product.isBestSeller && (
              <div className="absolute top-4 right-4 md:top-8 md:right-8 bg-emerald-950/90 text-amber-400 px-2 py-1 md:px-4 md:py-2 rounded-lg md:rounded-xl backdrop-blur-md border border-amber-400/20 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1 md:gap-2">
                <Star size={10} className="md:size-8" fill="currentColor" />
                <span className="hidden sm:inline">Elite Selection</span>
                <span className="sm:hidden">مميز</span>
              </div>
            )}
          </MotionDiv>

          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-4 px-1 no-scrollbar">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`relative w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === img
                    ? "border-emerald-500 shadow-md md:shadow-lg ring-2 md:ring-4 ring-emerald-50"
                    : "border-transparent bg-stone-50 opacity-50 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`view-${i}`}
                  fill
                  className="object-cover p-1 md:p-2"
                  unoptimized
                  sizes="(max-width: 768px) 64px, 96px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* --- 2. INFO SECTION - Mobile Optimized --- */}
        <div className="flex flex-col mt-4 md:mt-0">
          <div className="mb-6 md:mb-10 border-b border-stone-100 pb-6 md:pb-10">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <span
                className={`text-[8px] md:text-[9px] px-3 py-1 md:px-4 md:py-1.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1 md:gap-2 ${
                  product.stockQuantity > 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-600"
                }`}
              >
                {product.stockQuantity > 0 ? (
                  <CheckCircle size={10} className="md:size-6" />
                ) : (
                  <Minus size={10} className="md:size-12" />
                )}
                <span className="whitespace-nowrap">
                  {product.stockQuantity > 0 ? "متوفر" : "نفذت الكمية"}
                </span>
              </span>
              <span className="w-1 h-1 bg-stone-200 rounded-full hidden md:block" />
              <span className="text-stone-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest truncate">
                {categoryName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-emerald-950 mb-4 md:mb-8 leading-tight tracking-tighter">
              {product.name}
            </h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-8">
              <div className="flex flex-col w-full sm:w-auto">
                <span className="text-stone-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  القيمة الحالية
                </span>
                <div className="flex items-baseline gap-2 md:gap-3">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black text-emerald-600 tracking-tighter">
                    ${product.pricePurchase.toLocaleString()}
                  </span>
                  {product.priceOld && (
                    <span className="text-lg md:text-xl text-stone-300 line-through decoration-emerald-500/20">
                      ${product.priceOld}
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden sm:block h-8 md:h-10 w-px bg-stone-100" />
              <div className="flex flex-col w-full sm:w-auto">
                <div className="flex text-amber-500 gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={12}
                      className="md:size-6"
                      fill={
                        i <= Math.round(averageRating) ? "currentColor" : "none"
                      }
                    />
                  ))}
                </div>
                <span className="text-stone-400 text-[9px] font-black tracking-widest whitespace-nowrap">
                  تقييم {averageRating.toFixed(1)} ({totalReviews})
                </span>
              </div>
            </div>
          </div>

          {/* Properties Grid - Mobile Optimized */}
          {/* Properties Grid - إظهار النص بالكامل */}
          {product.properties && product.properties.length > 0 && (
            <div className="mb-6 md:mb-10 bg-stone-50/50 rounded-xl md:rounded-[2rem] p-4 md:p-8 border border-stone-100">
              <h3 className="text-[10px] font-black text-emerald-950 mb-4 md:mb-8 flex items-center gap-2 md:gap-3 uppercase tracking-[0.3em]">
                <Settings2 size={14} className="md:size-8 text-amber-500" />
                المواصفات الفنية
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-x-12 md:gap-y-6">
                {product.properties.slice(0, 4).map((prop, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-200/40 pb-2 md:pb-3 group"
                  >
                    <span className="text-[8px] md:text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1 md:mb-0 group-hover:text-emerald-600 transition-colors">
                      {prop.key}
                    </span>
                    <span className="text-sm md:text-base font-bold text-emerald-950 break-words whitespace-normal text-right md:text-left">
                      {prop.value}
                    </span>
                  </div>
                ))}
              </div>
              {product.properties.length > 4 && (
                <button
                  onClick={() => setActiveTab("properties")}
                  className="mt-4 text-emerald-600 text-sm font-bold hover:text-emerald-700 flex items-center gap-1"
                >
                  عرض جميع المواصفات ({product.properties.length})
                  <ChevronDown size={16} />
                </button>
              )}
            </div>
          )}

          {/* في قسم المواصفات في التبويبات */}
          {activeTab === "properties" &&
            product.properties &&
            product.properties.length > 0 && (
              <motion.div
                key="properties"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl md:rounded-[2rem] p-4 md:p-6 lg:p-8 border border-stone-100"
              >
                <h3 className="text-xl md:text-2xl font-black text-emerald-950 mb-4 md:mb-8">
                  المواصفات الفنية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                  {product.properties.map((prop, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-stone-100 hover:border-emerald-200 transition-colors"
                    >
                      <div className="text-xs md:text-sm font-medium text-stone-500 mb-1 md:mb-2">
                        {prop.key}
                      </div>
                      <div className="text-base md:text-lg font-bold text-emerald-950 break-words whitespace-normal leading-relaxed">
                        {prop.value}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          {/* Purchase Controls - Mobile Optimized */}
          <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <div className="flex items-center bg-stone-50 rounded-xl md:rounded-2xl h-14 md:h-16 w-full sm:w-auto p-1 md:p-1.5 border border-stone-100 shadow-inner">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 md:w-12 h-full flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:bg-white rounded-lg md:rounded-xl transition-all"
                >
                  <Minus size={12} className="md:size-6" />
                </button>
                <div className="w-12 md:w-14 h-full flex items-center justify-center font-black text-emerald-950 text-lg md:text-xl">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 md:w-12 h-full flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:bg-white rounded-lg md:rounded-xl transition-all"
                >
                  <Plus size={16} className="md:size-6" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity < 1 || isAdding}
                className={`flex-1 h-14 md:h-16 p-3 md:p-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-3 md:gap-4 transition-all uppercase tracking-[0.2em] shadow-lg md:shadow-xl ${
                  product.stockQuantity < 1
                    ? "bg-stone-100 text-stone-300 cursor-not-allowed shadow-none"
                    : "bg-emerald-950 text-white hover:bg-emerald-800 hover:shadow-emerald-900/20 active:scale-95"
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdding ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, rotate: 0 }}
                      animate={{ opacity: 1, rotate: 360 }}
                      exit={{ opacity: 0 }}
                    >
                      <RefreshCw
                        size={20}
                        className="md:size-24 animate-spin"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 md:gap-3"
                    >
                      <ShoppingBag size={16} className="md:size-8" />
                      <span className="whitespace-nowrap">
                        {product.stockQuantity > 0
                          ? "اقتناء الآن"
                          : "غير متوفر"}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Trust Indicators - Mobile Optimized */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 pt-4 md:pt-6 border-t border-stone-100">
            <div className="flex items-center gap-2 md:gap-4 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <Truck size={18} className="md:size-22" />
              </div>
              <div>
                <p className="font-black text-emerald-950 text-[10px] md:text-[10px] uppercase tracking-tighter">
                  شحن سيادي
                </p>
                <p className="text-[8px] md:text-[9px] text-stone-400 font-bold tracking-widest mt-0.5">
                  خلال 24 ساعة
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-4 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-lg md:rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <ShieldCheck size={18} className="md:size-22" />
              </div>
              <div>
                <p className="font-black text-emerald-950 text-[10px] md:text-[10px] uppercase tracking-tighter">
                  ضمان الأصالة
                </p>
                <p className="text-[8px] md:text-[9px] text-stone-400 font-bold tracking-widest mt-0.5">
                  100% موثق
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tabs Navigation (Sticky at bottom on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50 shadow-lg">
        <div className="flex justify-around py-3">
          <button
            onClick={() => {
              setActiveTab("description");
              document
                .getElementById("tabs-content")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center gap-1 ${
              activeTab === "description"
                ? "text-emerald-600"
                : "text-stone-400"
            }`}
          >
            <MessageSquare size={20} />
            <span className="text-[10px] font-bold">الوصف</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("reviews");
              document
                .getElementById("tabs-content")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className={`flex flex-col items-center gap-1 ${
              activeTab === "reviews" ? "text-emerald-600" : "text-stone-400"
            }`}
          >
            <Star size={20} />
            <span className="text-[10px] font-bold">التقييمات</span>
          </button>

          {product.properties && product.properties.length > 0 && (
            <button
              onClick={() => {
                setActiveTab("properties");
                document
                  .getElementById("tabs-content")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex flex-col items-center gap-1 ${
                activeTab === "properties"
                  ? "text-emerald-600"
                  : "text-stone-400"
              }`}
            >
              <Settings2 size={20} />
              <span className="text-[10px] font-bold">المواصفات</span>
            </button>
          )}
        </div>
      </div>

      {/* --- 3. TABS SECTION (Description & Reviews) - Mobile Optimized --- */}
      <div className="mt-12 md:mt-20" id="tabs-content">
        {/* Desktop Tabs Navigation */}
        <div className="hidden md:flex border-b border-stone-200 mb-6 md:mb-10">
          <button
            onClick={() => setActiveTab("description")}
            className={`flex items-center gap-3 px-4 md:px-8 py-3 md:py-4 text-sm font-black transition-all ${
              activeTab === "description"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-stone-400 hover:text-emerald-500"
            }`}
          >
            <MessageSquare size={18} />
            الوصف التفصيلي
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-3 px-4 md:px-8 py-3 md:py-4 text-sm font-black transition-all ${
              activeTab === "reviews"
                ? "text-emerald-600 border-b-2 border-emerald-600"
                : "text-stone-400 hover:text-emerald-500"
            }`}
          >
            <Star size={18} />
            التقييمات ({totalReviews})
          </button>

          {product.properties && product.properties.length > 0 && (
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex items-center gap-3 px-4 md:px-8 py-3 md:py-4 text-sm font-black transition-all ${
                activeTab === "properties"
                  ? "text-emerald-600 border-b-2 border-emerald-600"
                  : "text-stone-400 hover:text-emerald-500"
              }`}
            >
              <Settings2 size={18} />
              المواصفات
            </button>
          )}
        </div>

        {/* Tabs Content */}
        <div className="min-h-[300px] md:min-h-[400px] pb-20 md:pb-0">
          {/* Description Tab */}
          <AnimatePresence mode="wait">
            {activeTab === "description" && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-stone-50 rounded-xl md:rounded-[2rem] p-4 md:p-6 lg:p-10 border border-stone-100"
              >
                <h3 className="text-xl md:text-2xl font-black text-emerald-950 mb-4 md:mb-6">
                  وصف المنتج
                </h3>

                <div className="space-y-4 md:space-y-6">
                  {product.description && product.description.length > 0 ? (
                    <ul className="space-y-3 md:space-y-4">
                      {product.description.map((desc, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 md:gap-4"
                        >
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full mt-2 md:mt-3 flex-shrink-0" />
                          <p className="text-stone-700 leading-relaxed text-base md:text-lg">
                            {desc}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-stone-500 italic">
                      لا يوجد وصف مفصل لهذا المنتج.
                    </p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-10 pt-6 md:pt-10 border-t border-stone-200">
                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-base md:text-lg font-black text-emerald-950 flex items-center gap-2 md:gap-3">
                        <CheckCircle
                          className="text-emerald-600 md:size-8"
                          size={18}
                        />
                        مميزات المنتج
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 md:gap-3 text-stone-600">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          <span className="text-sm md:text-base">
                            جودة استثنائية
                          </span>
                        </li>
                        <li className="flex items-center gap-2 md:gap-3 text-stone-600">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          <span className="text-sm md:text-base">
                            ضمان لمدة عامين
                          </span>
                        </li>
                        <li className="flex items-center gap-2 md:gap-3 text-stone-600">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          <span className="text-sm md:text-base">
                            تصميم فاخر وأنيق
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                      <h4 className="text-base md:text-lg font-black text-emerald-950 flex items-center gap-2 md:gap-3">
                        <AlertCircle
                          className="text-amber-600 md:size-8"
                          size={18}
                        />
                        معلومات هامة
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 md:gap-3 text-stone-600">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                          <span className="text-sm md:text-base">
                            منتج جديد بالكامل
                          </span>
                        </li>
                        <li className="flex items-center gap-2 md:gap-3 text-stone-600">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                          <span className="text-sm md:text-base">
                            شحن مجاني للطلبات فوق $100
                          </span>
                        </li>
                        <li className="flex items-center gap-2 md:gap-3 text-stone-600">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                          <span className="text-sm md:text-base">
                            إرجاع مجاني خلال 14 يوم
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 md:space-y-8"
              >
                {/* Reviews Summary */}
                <div className="bg-emerald-50 rounded-xl md:rounded-[2rem] p-4 md:p-6 lg:p-8 border border-emerald-100">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <span className="text-3xl md:text-4xl lg:text-5xl font-black text-emerald-950">
                          {averageRating.toFixed(1)}
                        </span>
                        <div className="flex flex-col">
                          <div className="flex text-amber-500 gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                size={14}
                                className="md:size-8"
                                fill={
                                  i <= Math.round(averageRating)
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-stone-500 text-xs md:text-sm">
                            {totalReviews} تقييمات
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 md:space-y-2 w-full md:w-auto">
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const count = sampleReviews.filter(
                          (r) => r.rating === rating
                        ).length;
                        const percentage = (count / totalReviews) * 100;

                        return (
                          <div
                            key={rating}
                            className="flex items-center gap-2 md:gap-3"
                          >
                            <span className="text-xs md:text-sm font-medium text-stone-600 w-4">
                              {rating}
                            </span>
                            <Star
                              size={14}
                              className="md:size-8 text-amber-500"
                              fill="currentColor"
                            />
                            <div className="flex-1 md:w-32 bg-stone-200 rounded-full h-1.5 md:h-2">
                              <div
                                className="bg-amber-500 h-1.5 md:h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs md:text-sm text-stone-500 w-6 md:w-8 text-right">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4 md:space-y-6">
                  <h3 className="text-xl md:text-2xl font-black text-emerald-950">
                    آراء العملاء
                  </h3>

                  {sampleReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-white rounded-lg md:rounded-[1.5rem] p-4 md:p-6 border border-stone-100 shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-3 md:mb-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600">
                            <User size={20} className="md:size-8" />
                          </div>
                          <div>
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                              <h4 className="font-bold text-emerald-950 text-sm md:text-base">
                                {review.name}
                              </h4>
                              {review.verified && (
                                <span className="text-xs px-1.5 py-0.5 md:px-2 md:py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                  موثوق
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mt-1">
                              <div className="flex text-amber-500">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <Star
                                    key={i}
                                    size={12}
                                    className="md:size-8"
                                    fill={
                                      i <= review.rating
                                        ? "currentColor"
                                        : "none"
                                    }
                                  />
                                ))}
                              </div>
                              <span className="text-stone-400 text-xs md:text-sm">
                                <Calendar
                                  size={12}
                                  className="inline mr-1 md:size-8"
                                />
                                {review.date}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button className="flex items-center gap-1 md:gap-2 text-stone-400 hover:text-emerald-600">
                          <ThumbsUp size={16} className="md:size-12" />
                          <span className="text-xs md:text-sm">
                            {review.likes}
                          </span>
                        </button>
                      </div>

                      <p className="text-stone-700 leading-relaxed text-sm md:text-base">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Review Form */}
                <div className="bg-stone-50 rounded-xl md:rounded-[2rem] p-4 md:p-6 lg:p-8 border border-stone-100 mt-8 md:mt-12">
                  <h3 className="text-xl md:text-2xl font-black text-emerald-950 mb-4 md:mb-6">
                    أضف تقييمك
                  </h3>

                  <form
                    onSubmit={handleSubmitReview}
                    className="space-y-4 md:space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        تقييمك
                      </label>
                      <div className="flex gap-1 md:gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() =>
                              setNewReview((prev) => ({ ...prev, rating }))
                            }
                            className="text-amber-500 hover:text-amber-600 transition-colors"
                          >
                            <Star
                              size={24}
                              className="md:size-12"
                              fill={
                                rating <= newReview.rating
                                  ? "currentColor"
                                  : "none"
                              }
                              strokeWidth={1.5}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          value={newReview.name}
                          onChange={(e) =>
                            setNewReview((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full bg-white border border-stone-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-stone-700 mb-2">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          value={newReview.email}
                          onChange={(e) =>
                            setNewReview((prev) => ({
                              ...prev,
                              email: e.target.value,
                            }))
                          }
                          className="w-full bg-white border border-stone-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">
                        رأيك في المنتج
                      </label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) =>
                          setNewReview((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full bg-white border border-stone-200 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="شاركنا تجربتك مع هذا المنتج..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl font-bold hover:bg-emerald-700 transition-colors w-full md:w-auto"
                    >
                      نشر التقييم
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* Properties Tab */}
            {activeTab === "properties" &&
              product.properties &&
              product.properties.length > 0 && (
                <motion.div
                  key="properties"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-xl md:rounded-[2rem] p-4 md:p-6 lg:p-8 border border-stone-100"
                >
                  <h3 className="text-xl md:text-2xl font-black text-emerald-950 mb-4 md:mb-8">
                    المواصفات الفنية
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                    {product.properties.map((prop, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-50 rounded-lg md:rounded-xl p-4 md:p-6 border border-stone-100 hover:border-emerald-200 transition-colors"
                      >
                        <div className="text-xs md:text-sm font-medium text-stone-500 mb-1 md:mb-2">
                          {prop.key}
                        </div>
                        <div className="text-base md:text-lg font-bold text-emerald-950">
                          {prop.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
