
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, ShoppingCart, Heart, User, 
  ChevronDown, Globe, LogOut, Phone, UserCircle, Store, Loader2, ArrowRight, Sparkles
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
  
  // Menus State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); 
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Search Data
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const wishlistCount = user?.favorites?.length || 0;
  const pathname = usePathname();

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load Categories
  useEffect(() => {
    api.get('/categories')
      .then(res => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(console.error);
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
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-emerald-950/95 backdrop-blur-xl shadow-2xl border-emerald-500/10 py-3' 
            : 'bg-white border-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Logo Section */}
            <Link href="/" className="flex items-center gap-3 group shrink-0 relative z-50">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-6 transition-all shadow-emerald-500/20">
                F
              </div>
              <div className="flex flex-col -space-y-1">
                <span className={`font-black text-xl tracking-tighter transition-colors ${isScrolled ? 'text-white' : 'text-emerald-950'}`}>
                  Furato
                </span>
                <span className="text-[7px] font-black text-emerald-500 uppercase tracking-[0.3em]">Emerald Elite</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
              <NavLink href="/" label="الرئيسية" active={pathname === '/'} scrolled={isScrolled} />
              <NavLink href="/products" label="المنتجات" active={pathname === '/products'} scrolled={isScrolled} />
              <NavLink href="/stores" label="المتاجر" active={pathname === '/stores'} scrolled={isScrolled} />
              
              <div className="relative group z-50">
                <button className={`flex items-center gap-1.5 text-[16px] font-black uppercase tracking-widest transition-colors py-2 ${isScrolled ? 'text-emerald-50/70 hover:text-white' : 'text-emerald-900/60 hover:text-emerald-600'}`}>
                  الفئات <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </button>
                <div className="absolute top-full right-0 w-64 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className={`rounded-2xl shadow-3xl overflow-hidden p-2 border ${isScrolled ? 'bg-emerald-950 border-emerald-500/20 shadow-emerald-900/40' : 'bg-white border-emerald-50 shadow-xl'}`}>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar px-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/products?category=${cat._id}`}
                          className={`flex items-center justify-between px-5 py-3 rounded-xl text-[16px] font-bold transition-all mb-1 last:mb-0 ${isScrolled ? 'text-emerald-50/70 hover:bg-emerald-600 hover:text-white' : 'text-emerald-900/70 hover:bg-emerald-50 hover:text-emerald-600'}`}
                        >
                          {cat.name}
                          <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Actions & Search Box */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Desktop Search */}
              <div 
                ref={searchContainerRef}
                className={`hidden lg:flex items-center relative transition-all duration-500 ${isSearchOpen ? 'w-64 xl:w-80' : 'w-10'}`}
              >
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`absolute left-0 z-10 p-2.5 transition-colors ${isSearchOpen ? 'pointer-events-none text-emerald-400' : (isScrolled ? 'text-emerald-50/60 hover:text-white' : 'text-emerald-900/60 hover:text-emerald-600')}`}
                >
                  <Search size={20} />
                </button>
                
                <form onSubmit={handleSearchSubmit} className="w-full">
                  <input
                    type="text"
                    placeholder="بحث نخبوي..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className={`w-full rounded-2xl py-2.5 px-10 text-[16px] font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                      isScrolled 
                        ? 'bg-white/5 text-white border border-white/10' 
                        : 'bg-emerald-50 text-emerald-950 border border-emerald-100'
                    } ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible w-0'}`}
                  />
                </form>

                {/* Desktop Results Dropdown */}
                <AnimatePresence>
                  {isSearchOpen && (searchResults.length > 0 || isSearching) && (
                    <MotionDiv
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className={`absolute top-full left-0 right-0 mt-4 rounded-2xl shadow-3xl border overflow-hidden z-[60] ${isScrolled ? 'bg-emerald-950 border-emerald-500/20' : 'bg-white border-emerald-50'}`}
                    >
                      {isSearching ? (
                         <div className="p-6 flex justify-center text-emerald-500">
                           <Loader2 className="animate-spin" size={20} />
                         </div>
                      ) : (
                         <div className="max-h-80 overflow-y-auto custom-scrollbar">
                            {searchResults.map((product) => (
                               <Link 
                                 key={product._id} 
                                 href={`/products/${product._id}`}
                                 className={`flex items-center gap-4 p-4 border-b last:border-0 transition-colors ${isScrolled ? 'border-emerald-500/10 hover:bg-emerald-900' : 'border-emerald-50 hover:bg-emerald-50'}`}
                               >
                                  <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                                    {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" />}
                                  </div>
                                  <div className="flex-1 min-w-0 text-right">
                                     <p className={`text-[16px] font-black truncate ${isScrolled ? 'text-white' : 'text-emerald-950'}`}>{product.name}</p>
                                     <p className="text-[14px] text-emerald-500 font-bold">${product.pricePurchase}</p>
                                  </div>
                               </Link>
                            ))}
                         </div>
                      )}
                    </MotionDiv>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Search Toggle */}
              <button 
                className={`lg:hidden p-2.5 rounded-xl transition-colors ${isScrolled ? 'text-white bg-white/10' : 'text-emerald-950 bg-emerald-50'}`}
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                {isMobileSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>

              <Link href="/cart" className="relative p-2.5 rounded-xl transition-all text-emerald-500 hover:bg-emerald-500/10">
                <ShoppingCart size={20} strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-emerald-600 text-white text-[8px] font-black flex items-center justify-center rounded-full border border-emerald-950">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu / Profile */}
              <div className="hidden sm:flex items-center relative pr-4 border-r border-emerald-500/10">
                {user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className={`flex items-center gap-2.5 p-1 px-3 rounded-xl transition-all border ${isScrolled ? 'bg-emerald-600/20 text-white border-emerald-500/20' : 'bg-emerald-50 text-emerald-950 border-emerald-100'}`}
                    >
                      <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-black text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[14px] font-black uppercase tracking-widest hidden md:block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                      <ChevronDown size={12} />
                    </button>
                    
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <MotionDiv
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute top-full left-0 mt-3 w-56 rounded-2xl shadow-3xl border overflow-hidden p-2 z-[100] ${isScrolled ? 'bg-emerald-950 border-emerald-500/20' : 'bg-white border-emerald-50'}`}
                        >
                          <div className={`px-4 py-3 border-b mb-1 rounded-xl ${isScrolled ? 'bg-emerald-900/50 border-emerald-500/10' : 'bg-gray-50 border-gray-100'}`}>
                            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">Elite Member</p>
                            <p className={`text-[14px] font-bold truncate ${isScrolled ? 'text-emerald-50/60' : 'text-gray-500'}`}>{user.email}</p>
                          </div>
                          <Link href="/profile" className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${isScrolled ? 'text-emerald-50/70 hover:bg-emerald-600 hover:text-white' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}`}>
                            <UserCircle size={18} /> ملفي الشخصي
                          </Link>
                          {user.role === 'admin' && (
                             <Link href="/admin" className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${isScrolled ? 'text-emerald-50/70 hover:bg-emerald-600 hover:text-white' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'}`}>
                               <Globe size={16} /> لوحة الإدارة
                             </Link>
                          )}
                          <div className={`h-px my-1 ${isScrolled ? 'bg-emerald-500/10' : 'bg-gray-100'}`} />
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-[14px] font-bold text-rose-500 hover:bg-rose-500/10 transition-all text-right"
                          >
                            <LogOut size={18} /> تسجيل الخروج
                          </button>
                        </MotionDiv>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link href="/login" className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[14px] uppercase tracking-[0.2em] shadow-lg transition-all ${isScrolled ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/40' : 'bg-emerald-950 text-white hover:bg-emerald-800 shadow-emerald-900/10'}`}>
                    دخول
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className={`lg:hidden p-2.5 rounded-xl transition-colors ${isScrolled ? 'text-white bg-white/10' : 'text-emerald-950 bg-emerald-50'}`}
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Slide Down */}
          <AnimatePresence>
            {isMobileSearchOpen && (
              <MotionDiv
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden mt-4"
              >
                <div className="pb-4 relative">
                   <form onSubmit={handleSearchSubmit}>
                      <input
                        type="text"
                        placeholder="ابحث عن مقتنياتك..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        autoFocus
                        className={`w-full rounded-2xl py-4 px-6 pr-14 text-sm font-bold focus:outline-none transition-all ${isScrolled ? 'bg-white/10 text-white border border-white/10' : 'bg-emerald-50 text-emerald-950 border border-emerald-100'}`}
                      />
                      <Search className="absolute right-5 top-4 text-emerald-500" size={18} />
                      {isSearching && <Loader2 className="absolute left-5 top-4 text-emerald-500 animate-spin" size={18} />}
                   </form>

                   {/* Mobile Results */}
                   {searchResults.length > 0 && (
                      <div className={`mt-3 rounded-2xl shadow-2xl border overflow-hidden max-h-64 overflow-y-auto ${isScrolled ? 'bg-emerald-900 border-emerald-500/20' : 'bg-white border-emerald-50'}`}>
                         {searchResults.map((product) => (
                            <Link 
                              key={product._id} 
                              href={`/products/${product._id}`}
                              className="flex items-center gap-4 p-4 border-b last:border-0"
                            >
                               <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                                 {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" />}
                               </div>
                               <div className="flex-1 min-w-0 text-right">
                                  <p className={`text-[16px] font-black truncate ${isScrolled ? 'text-white' : 'text-emerald-950'}`}>{product.name}</p>
                                  <p className="text-[14px] text-emerald-500 font-bold">${product.pricePurchase}</p>
                               </div>
                            </Link>
                         ))}
                      </div>
                   )}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Menu Sidebar - Emerald Deep */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <MotionDiv
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-emerald-950/60 backdrop-blur-md z-[200] lg:hidden"
            />
            <MotionAside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] sm:w-80 bg-emerald-950 z-[210] shadow-3xl lg:hidden flex flex-col p-8"
            >
              <div className="flex items-center justify-between mb-16">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black text-sm">F</div>
                    <span className="font-black text-xl text-white tracking-tighter">Furato.</span>
                 </div>
                 <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-white/5 rounded-xl text-emerald-400 hover:text-white"><X size={20} /></button>
              </div>

              <nav className="space-y-4 flex-1">
                 <MobileLink href="/" label="الرئيسية" active={pathname === '/'} />
                 <MobileLink href="/products" label="المتجر الكامل" active={pathname === '/products'} />
                 <MobileLink href="/stores" label="شركاء فوراتو" active={pathname === '/stores'} />
                 <div className="h-px bg-white/5 my-8" />
                 <div className="space-y-6">
                    <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">المجموعات المختارة</p>
                    {categories.slice(0, 5).map(cat => (
                       <Link key={cat._id} href={`/products?category=${cat._id}`} className="block text-emerald-50/60 text-lg font-bold hover:text-emerald-400 transition-colors">{cat.name}</Link>
                    ))}
                 </div>
              </nav>

              <div className="pt-8 border-t border-white/5">
                 {user ? (
                   <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black">{user.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                         <p className="font-black text-white truncate">{user.name}</p>
                         <button onClick={handleLogout} className="text-rose-500 text-[14px] font-black uppercase tracking-widest mt-1">خروج</button>
                      </div>
                      <Link href="/profile" className="p-3 bg-white/10 rounded-xl text-white"><ArrowRight size={18} /></Link>
                   </div>
                 ) : (
                   <Link href="/login" className="flex items-center justify-center gap-3 w-full py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-sm tracking-widest uppercase shadow-2xl">
                     <User size={18} /> سجل دخولك الآن
                   </Link>
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

function NavLink({ href, label, active, scrolled }: { href: string; label: string; active: boolean; scrolled: boolean }) {
  return (
    <Link 
      href={href} 
      className={`relative py-2 text-[16px] font-black uppercase tracking-[0.2em] transition-colors ${
        active 
          ? (scrolled ? 'text-emerald-400' : 'text-emerald-600') 
          : (scrolled ? 'text-emerald-50/60 hover:text-white' : 'text-emerald-950/60 hover:text-emerald-950')
      }`}
    >
      {label}
      {active && (
        <MotionDiv 
          layoutId="header_line"
          className={`absolute -bottom-1 inset-x-0 h-0.5 rounded-full ${scrolled ? 'bg-emerald-500' : 'bg-emerald-600'}`}
        />
      )}
    </Link>
  );
}

function MobileLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`block py-4 text-2xl font-black tracking-tighter transition-all ${
        active ? 'text-emerald-400 translate-x-2' : 'text-white hover:text-emerald-500 hover:translate-x-1'
      }`}
    >
      {label}
    </Link>
  );
}
