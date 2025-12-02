'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Category } from '@/lib/types';
import {
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  User,
  Heart,
  ShoppingCart,
  GitCompare,
  History
} from 'lucide-react';

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false); // mobile menu
  const [dark, setDark] = useState(false);

  // Fake counters (استبدلها ببياناتك لاحقًا)
  const cartCount = 2;
  const wishlistCount = 5;
  const compareCount = 1;

  // Theme Handler
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // Fetch categories
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetch();
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">

        {/* Left */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="logo" className="h-9 w-9 rounded-full" />
            <span className="font-semibold text-xl text-raqqa-river dark:text-white">
              سوق الرقة
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-gray-700 dark:text-gray-200">
            <Link href="/" className="hover:text-raqqa-green transition">الرئيسية</Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-raqqa-green transition">
                الفئات <ChevronDown size={16} />
              </button>

              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 
                              transform group-hover:translate-y-1">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <div key={cat._id} className="border-b dark:border-gray-700 last:border-none">
                      <Link
                        href={`/categories/${cat.slug ?? cat.name}`}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {cat.name}
                      </Link>

                      {cat.subcategories?.length > 0 && (
                        <div className="pl-4 pb-2">
                          {cat.subcategories.map((s, i) => (
                            <Link
                              key={i}
                              href={`/categories/${cat.slug ?? cat.name}/${s}`}
                              className="block px-4 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                              {s}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-gray-500">لا توجد فئات متاحة.</p>
                )}
              </div>
            </div>

            <Link href="/products" className="hover:text-raqqa-green transition">المنتجات</Link>
            <Link href="/contact" className="hover:text-raqqa-green transition">اتصل بنا</Link>
          </nav>
        </div>

        {/* Right Icons Section */}
        <div className="flex items-center gap-3">

          {/* Search History */}
          <Link
            href="/search/history"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <History size={22} />
          </Link>

          {/* Compare */}
          <Link
            href="/compare"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <GitCompare size={22} />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Login */}
          <Link
            href="/auth/login"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <User size={22} />
          </Link>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Mobile Menu Btn */}
          <button onClick={() => setOpen(true)} className="md:hidden p-2">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-[60] flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          ></div>

          <aside className="relative bg-white dark:bg-gray-900 w-72 h-full shadow-xl p-5">
            <button className="absolute top-4 right-4 p-1" onClick={() => setOpen(false)}>
              <X size={26} />
            </button>

            <nav className="mt-12 space-y-4">

              <Link href="/" className="block text-lg">الرئيسية</Link>

              <div>
                <p className="font-semibold text-gray-600 dark:text-gray-300 mb-2">الفئات</p>

                <div className="space-y-3">
                  {categories.map(cat => (
                    <div key={cat._id}>
                      <Link
                        href={`/categories/${cat.slug ?? cat.name}`}
                        className="block p-2 rounded bg-gray-100 dark:bg-gray-800"
                      >
                        {cat.name}
                      </Link>

                      {cat.subcategories?.length > 0 && (
                        <div className="ml-4 mt-1 space-y-1">
                          {cat.subcategories.map((s, i) => (
                            <Link
                              key={i}
                              href={`/categories/${cat.slug ?? cat.name}/${s}`}
                              className="block text-sm px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              {s}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/products" className="block text-lg">المنتجات</Link>
              <Link href="/contact" className="block text-lg">اتصل بنا</Link>

              <hr className="my-4 border-gray-300 dark:border-gray-700" />

              {/* Mobile Icons section */}
              <div className="flex items-center gap-4 text-gray-700 dark:text-gray-200 mt-4">
                
                <Link href="/auth/login" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                  <User size={22} />
                </Link>

                <Link href="/wishlist" className="relative p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                  <Heart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link href="/compare" className="relative p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                  <GitCompare size={22} />
                  {compareCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {compareCount}
                    </span>
                  )}
                </Link>

                <Link href="/cart" className="relative p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <Link href="/search/history" className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">
                  <History size={22} />
                </Link>

              </div>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
