'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from './api';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  favorites?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // التحقق من التوكن عند تحميل التطبيق
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // جلب بيانات المستخدم من الباك اند
          const res = await api.get('/users/profile');
          setUser(res.data);
        } catch (error) {
          console.error('Session expired or invalid token');
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    setUser(userData);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  const register = async (userData: any) => {
    // الباك اند الخاص بك يتوقع التسجيل عبر /auth/register
    // ويفترض أن يعيد توكن ومستخدم، أو يمكنك تسجيل الدخول مباشرة بعد التسجيل
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      router.push('/');
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}