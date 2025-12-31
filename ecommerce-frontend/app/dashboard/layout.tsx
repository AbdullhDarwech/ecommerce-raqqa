'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Home, Package, Folder, ShoppingCart, Heart, Settings, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role === 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  if (!user || user.role === 'admin') return <p>غير مصرح لك</p>;

  return (
    <div className="flex min-h-screen bg-raqqa-sand">
      <aside className="w-64 bg-raqqa-river text-white p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Dashboard المستخدم</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="flex items-center space-x-3 hover:bg-raqqa-green p-3 rounded-lg transition">
            <Home size={20} /> <span>الرئيسية</span>
          </Link>
          <Link href="/dashboard/categories" className="flex items-center space-x-3 hover:bg-raqqa-green p-3 rounded-lg transition">
            <Folder size={20} /> <span>الفئات</span>
          </Link>
          <Link href="/dashboard/products" className="flex items-center space-x-3 hover:bg-raqqa-green p-3 rounded-lg transition">
            <Package size={20} /> <span>المنتجات</span>
          </Link>
          <Link href="/dashboard/orders" className="flex items-center space-x-3 hover:bg-raqqa-green p-3 rounded-lg transition">
            <ShoppingCart size={20} /> <span>الطلبات</span>
          </Link>
          <Link href="/dashboard/favorites" className="flex items-center space-x-3 hover:bg-raqqa-green p-3 rounded-lg transition">
            <Heart size={20} /> <span>المفضلة</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center space-x-3 hover:bg-raqqa-green p-3 rounded-lg transition">
            <Settings size={20} /> <span>الإعدادات</span>
          </Link>
          <button onClick={logout} className="flex items-center space-x-3 hover:bg-red-500 p-3 rounded-lg w-full text-left transition">
            <LogOut size={20} /> <span>تسجيل خروج</span>
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-white rounded-l-3xl shadow-inner">
        {children}
      </main>
    </div>
  );
}