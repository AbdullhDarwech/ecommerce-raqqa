'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Users, 
  Store, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  if (loading) return <div className="h-screen flex items-center justify-center">جاري التحميل...</div>;
  if (!user || user.role !== 'admin') return null;

  const navItems = [
    { href: '/admin', label: 'لوحة التحكم', icon: <LayoutDashboard size={20} /> },
    { href: '/admin/products', label: 'المنتجات', icon: <Package size={20} /> },
    { href: '/admin/categories', label: 'الفئات', icon: <Layers size={20} /> },
    { href: '/admin/orders', label: 'الطلبات', icon: <ShoppingCart size={20} /> },
    { href: '/admin/stores', label: 'المتاجر', icon: <Store size={20} /> },
    { href: '/admin/users', label: 'المستخدمين', icon: <Users size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 right-0 z-40 w-64 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-gray-100">
            <h1 className="text-xl font-bold text-emerald-600">لوحة الإدارة</h1>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-600 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut size={20} />
              تسجيل خروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:p-14 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header (Mobile Toggle) */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="mr-4 font-bold text-gray-800">القائمة</span>
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
