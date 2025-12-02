'use client';

import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-4 text-center">تسجيل دخول الأدمن</h1>
        <AuthForm />
      </div>
    </div>
  );
}
