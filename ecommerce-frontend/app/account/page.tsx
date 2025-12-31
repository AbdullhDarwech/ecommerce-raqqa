'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) return <p>يرجى تسجيل الدخول</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">الحساب</h1>
      <div className="space-y-4">
        <Link href="/account/orders" className="block bg-raqqa-sand p-4 rounded">الطلبات السابقة</Link>
        <Link href="/account/favorites" className="block bg-raqqa-sand p-4 rounded">المفضلة</Link>
        <div className="bg-raqqa-sand p-4 rounded">
          <h2 className="text-xl font-semibold">المعلومات الشخصية</h2>
          <p>الاسم: {user.name}</p>
          <p>البريد: {user.email}</p>
        </div>
      </div>
    </div>
  );
}