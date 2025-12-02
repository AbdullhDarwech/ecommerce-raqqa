'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart3, Package, Folder, ShoppingCart, Users, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user || loading) return null; // أو <p>جارٍ التحقق...</p>

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-raqqa-river text-white p-4">
        <h2 className="text-xl font-bold mb-4">Dashboard الأدمن</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center space-x-2 hover:bg-raqqa-green p-2 rounded">
            <BarChart3 /> <span>الإحصائيات</span>
          </Link>
          <Link href="/admin/products" className="flex items-center space-x-2 hover:bg-raqqa-green p-2 rounded">
            <Package /> <span>المنتجات</span>
          </Link>
          <Link href="/admin/categories" className="flex items-center space-x-2 hover:bg-raqqa-green p-2 rounded">
            <Folder /> <span>الفئات</span>
          </Link>
          <Link href="/admin/orders" className="flex items-center space-x-2 hover:bg-raqqa-green p-2 rounded">
            <ShoppingCart /> <span>الطلبات</span>
          </Link>
          <Link href="/admin/users" className="flex items-center space-x-2 hover:bg-raqqa-green p-2 rounded">
            <Users /> <span>المستخدمين</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center space-x-2 hover:bg-raqqa-green p-2 rounded w-full text-left">
            <LogOut /> <span>تسجيل خروج</span>
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
