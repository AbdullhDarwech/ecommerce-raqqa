'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, ShoppingCart, Heart, User, 
  ChevronDown, Globe, LogOut, Phone, UserCircle, Store, Loader2, ArrowRight
} from 'lucide-react';
import api from '@/lib/api';
import { Category, Product } from '@/lib/types';
import { useAuth } from '@/lib/auth';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const MotionDiv = motion.div as any;
const MotionAside = motion.aside as any;

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  // Menus
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // Desktop search expand
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // Mobile search slide-down
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search Data
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Mock Data
  // const cartCount = 2; // Ideally from useCart()
  const wishlistCount = user?.favorites?.length || 0;

  const pathname = usePathname();

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Route Change Cleanup
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsSearchOpen(false);
    setIsMobileSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [pathname]);

  // Click Outside (Desktop Search)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        // Only clear if not clicking inside the mobile search input (which is outside this ref)
        if (window.innerWidth >= 1024) { 
           setSearchResults([]);
           setIsSearchOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/login');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (query.trim().length > 1) {
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await api.get(`/products?search=${query}&limit=5`);
          setSearchResults(res.data.data || []);
        } catch (error) {
          console.error("Search error", error);
        } finally {
          setIsSearching(false);
        }
      }, 400);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${searchQuery}`);
      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
      setSearchResults([]);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-gray-200 py-3' 
            : 'bg-white border-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group relative shrink-0 z-50">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-emerald-500/30 transition-all">
                S
              </div>
              <span className="font-bold text-xl md:text-2xl tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
                Furato
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <NavLink href="/" label="الرئيسية" active={pathname === '/'} />
              <NavLink href="/products" label="المنتجات" active={pathname === '/products'} />
              <NavLink href="/stores" label="المتاجر" active={pathname === '/stores'} />
              
              <div className="relative group z-50">
                <button className="flex items-center gap-1 font-medium text-gray-600 hover:text-emerald-600 transition-colors py-2">
                  الفئات <ChevronDown size={16} />
                </button>
                <div className="absolute top-full right-0 w-60 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-2">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {categories.length > 0 ? (
                        categories.map((cat) => (
                          <Link
                            key={cat._id}
                            href={`/products?category=${cat.name}`}
                            className="block px-4 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))
                      ) : (
                        <span className="block px-4 py-2 text-sm text-gray-400">جاري التحميل...</span>
                      )}
                    </div>
                    <div className="h-px bg-gray-100 my-1" />
                    <Link href="/categories" className="block px-4 py-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 text-center">
                      عرض جميع الفئات
                    </Link>
                  </div>
                </div>
              </div>
              
              <NavLink href="/contact" label="اتصل بنا" active={pathname === '/contact'} />
            </nav>

            {/* Desktop Search */}
            <div 
              ref={searchContainerRef}
              className={`hidden lg:flex items-center relative transition-all duration-300 ${isSearchOpen ? 'w-80' : 'w-10'}`}
            >
              <button 
                onClick={() => {
                   setIsSearchOpen(!isSearchOpen);
                   if (!isSearchOpen) setTimeout(() => document.getElementById('desktop-search-input')?.focus(), 100);
                }}
                className={`absolute left-0 z-10 p-2 text-gray-500 hover:text-emerald-600 ${isSearchOpen ? 'pointer-events-none' : ''}`}
              >
                <Search size={20} />
              </button>
              
              <form onSubmit={handleSearchSubmit} className="w-full">
                <input
                  id="desktop-search-input"
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`w-full bg-gray-100 rounded-full py-2.5 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                    isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible w-0'
                  }`}
                />
              </form>

              {isSearchOpen && (
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-3 text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              )}

              {/* Live Search Results (Desktop) */}
              <AnimatePresence>
                {isSearchOpen && (searchResults.length > 0 || isSearching) && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[60]"
                  >
                    {isSearching ? (
                       <div className="p-4 flex justify-center text-gray-400">
                         <Loader2 className="animate-spin" size={20} />
                       </div>
                    ) : (
                       <div className="max-h-80 overflow-y-auto">
                          {searchResults.map((product) => (
                             <Link 
                               key={product._id} 
                               href={`/products/${product._id}`}
                               className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                             >
                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                                  {product.images?.[0] && (
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                                   <p className="text-xs text-emerald-600 font-bold">${product.pricePurchase}</p>
                                </div>
                             </Link>
                          ))}
                          <Link href={`/products?search=${searchQuery}`} className="block p-3 text-center text-xs font-bold text-emerald-600 hover:bg-emerald-50">
                             عرض جميع النتائج
                          </Link>
                       </div>
                    )}
                  </MotionDiv>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile Search Toggle */}
              <button 
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                onClick={() => {
                  setIsMobileSearchOpen(!isMobileSearchOpen);
                  setMobileMenuOpen(false);
                }}
              >
                {isMobileSearchOpen ? <X size={22} /> : <Search size={22} />}
              </button>

              <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all hidden sm:flex">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all">
                <ShoppingCart size={22} strokeWidth={2.2} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu (Desktop) */}
              <div className="hidden sm:flex items-center relative border-r border-gray-200 mr-2 pr-4">
                {user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <User size={18} />
                      </div>
                      <span className="max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown size={14} />
                    </button>
                    
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <MotionDiv
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden py-1 z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                            <p className="text-xs text-gray-500">مسجل كـ</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{user.email}</p>
                          </div>
                          <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                            <UserCircle size={16} /> ملفي الشخصي
                          </Link>
                          {user.role === 'admin' && (
                             <Link href="/admin" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                               <Globe size={16} /> لوحة الإدارة
                             </Link>
                          )}
                          <div className="h-px bg-gray-100 my-1"></div>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-right"
                          >
                            <LogOut size={16} /> تسجيل خروج
                          </button>
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-bold shadow-lg shadow-gray-200">
                    <User size={16} />
                    <span>دخول</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-800 bg-gray-100 rounded-lg ml-2 hover:bg-gray-200 transition-colors"
                onClick={() => {
                   setMobileMenuOpen(true);
                   setIsMobileSearchOpen(false);
                }}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          <AnimatePresence>
            {isMobileSearchOpen && (
              <MotionDiv
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden border-t border-gray-100 mt-3"
              >
                <div className="py-2">
                   <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        placeholder="ابحث عن منتج..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        autoFocus
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 pl-10 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      />
                      <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                      {isSearching && (
                        <Loader2 className="absolute right-10 top-3.5 text-emerald-500 animate-spin" size={18} />
                      )}
                   </form>

                   {/* Mobile Live Results */}
                   {(searchResults.length > 0) && (
                      <div className="mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                         {searchResults.map((product) => (
                            <Link 
                              key={product._id} 
                              href={`/products/${product._id}`}
                              onClick={() => setIsMobileSearchOpen(false)}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                            >
                               <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                                 {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" />}
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                                  <p className="text-xs text-emerald-600 font-bold">${product.pricePurchase}</p>
                               </div>
                            </Link>
                         ))}
                         <Link 
                            href={`/products?search=${searchQuery}`} 
                            onClick={() => setIsMobileSearchOpen(false)}
                            className="block p-3 text-center text-xs font-bold text-emerald-600 bg-gray-50"
                         >
                            عرض كل النتائج
                         </Link>
                      </div>
                   )}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Spacer */}
      <div className={`${isScrolled ? 'h-16' : 'h-20 md:h-24'} transition-all duration-300`} />

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm lg:hidden"
            />
            <MotionAside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] sm:w-80 bg-white z-[70] shadow-2xl lg:hidden overflow-y-auto flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-2xl text-gray-900">القائمة</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-2">
                  <MobileNavLink href="/" icon={<Globe size={20} />} label="الرئيسية" active={pathname === '/'} />
                  <MobileNavLink href="/products" icon={<ShoppingCart size={20} />} label="المتجر" active={pathname === '/products'} />
                  <MobileNavLink href="/stores" icon={<Store size={20} />} label="المتاجر" active={pathname === '/stores'} />
                  
                  <div className="py-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">الفئات</p>
                    <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                      {categories.map((cat) => (
                         <Link
                          key={cat._id}
                          href={`/products?category=${cat.name}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-emerald-600 rounded-lg transition-colors text-sm"
                        >
                          {cat.name}
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 my-4" />
                  
                  <MobileNavLink href="/contact" icon={<Phone size={20} />} label="اتصل بنا" active={pathname === '/contact'} />
                </nav>
              </div>

              {/* User Section (Mobile) */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                          <User size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link 
                          href="/profile"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-2 py-2 px-3 text-sm font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-colors"
                        >
                           <UserCircle size={18} /> ملفي
                        </Link>
                        {user.role === 'admin' && (
                          <Link 
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-center gap-2 py-2 px-3 text-sm font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition-colors"
                          >
                            <Globe size={18} /> الإدارة
                          </Link>
                        )}
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full mt-2 py-2.5 bg-white border border-red-100 text-red-500 hover:bg-red-50 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                      >
                          <LogOut size={16} /> تسجيل خروج
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <p className="font-bold text-gray-900">أهلاً بك زائري الكريم</p>
                        <p className="text-sm text-gray-500">سجل دخولك لاستكمال التسوق</p>
                      </div>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold text-center text-sm shadow-lg shadow-emerald-500/20 transition-all">
                          تسجيل الدخول
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full py-3 mt-2 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold text-center text-sm transition-all">
                          حساب جديد
                      </Link>
                    </>
                  )}
                </div>
            </MotionAside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ----------------------
// Helper Components
// ----------------------

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`relative font-medium transition-colors ${
        active ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'
      }`}
    >
      {label}
      {active && (
        <MotionDiv 
          layoutId="underline"
          className="absolute -bottom-1 right-0 w-full h-0.5 bg-emerald-600 rounded-full"
        />
      )}
    </Link>
  );
}

function MobileNavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}