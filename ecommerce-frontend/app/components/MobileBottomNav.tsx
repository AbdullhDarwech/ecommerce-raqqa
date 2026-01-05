
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, LayoutGrid, User, Menu } from 'lucide-react';

const MotionDiv = motion.div as any;

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: <Home size={20} />, label: 'الرئيسية', href: '/' },
    // { icon: <Search size={20} />, label: 'البحث', href: '/products?focus=search' },
    { icon: <Menu size={20} />, label: 'الفلترة', href: '/products?focus=filter' },
    { icon: <LayoutGrid size={20} />, label: 'المعرض', href: '/products' },
    { icon: <User size={20} />, label: 'حسابي', href: '/profile' },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // إذا كان الرابط يحتوي على وسيط تركيز (بحث أو فلترة)، نستخدم البصمة الزمنية لضمان الاستجابة
    if (href.includes('focus=')) {
      e.preventDefault();
      const url = new URL(href, window.location.origin);
      const focusType = url.searchParams.get('focus');
      const timestamp = Date.now();
      router.push(`/products?focus=${focusType}&t=${timestamp}`);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] lg:hidden w-[96%] max-w-lg pointer-events-none">
      <MotionDiv 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-emerald-950/85 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-1.5 shadow-[0_25px_50px_-12px_rgba(6,78,59,0.6)] flex items-center justify-around pointer-events-auto"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href.startsWith('/products') && pathname === '/products' && !item.href.includes('focus')) || (item.href.includes('focus') && pathname === '/products');
          
          // تحديد الحالة النشطة بدقة بناءً على الـ query params إذا لزم الأمر
          const isActuallyActive = item.href.includes('focus') 
            ? false // نترك التوهج للعناصر الأساسية فقط لتجنب تشتت المستخدم
            : (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)));

          return (
            <Link 
              key={item.label} 
              href={item.href} 
              onClick={(e) => handleNavClick(e, item.href)}
              className="relative group flex-1"
            >
              <div className={`flex flex-col items-center gap-1 py-1 rounded-[1.8rem] transition-all duration-500 ${
                isActuallyActive 
                  ? 'bg-emerald-600 text-white shadow-[0_10px_20px_-5px_rgba(16,185,129,0.5)] scale-105' 
                  : 'text-emerald-50/40 hover:text-emerald-50/80'
              }`}>
                <motion.div
                  animate={isActuallyActive ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
                
                <span className={`text-[7px] font-black uppercase tracking-[0.1em] transition-all duration-300 ${
                  isActuallyActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 absolute'
                }`}>
                  {item.label}
                </span>

                {isActuallyActive && (
                  <MotionDiv 
                    layoutId="active-pill-glow"
                    className="absolute -top-1 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_15px_#fbbf24] z-20"
                  />
                )}
                
                {/* تأثير النبض عند النقر */}
                <div className="absolute inset-0 rounded-[1.8rem] bg-white/0 active:bg-white/10 transition-colors pointer-events-none" />
              </div>
            </Link>
          );
        })}
      </MotionDiv>
    </div>
  );
}
