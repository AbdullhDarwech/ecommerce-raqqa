'use client';
import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-4 text-center">التسجيل</h1>
      <AuthForm isLogin={false} />
    </div>
  );
}