'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  adminToken: string | null; // للتسهيل
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          _id: decoded.id,
          name: decoded.name || '',
          email: decoded.email || '',
          role: decoded.role,
        });
        setAdminToken(token);
      } catch (error) {
        console.error('Error decoding token on load:', error);
        localStorage.removeItem('adminToken');
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('adminToken', token);
    try {
      const decoded: any = jwtDecode(token);
      const newUser: User = {
        _id: decoded.id,
        name: decoded.name || '',
        email: decoded.email || '',
        role: decoded.role,
      };
      setUser(newUser);
      setAdminToken(token);
    } catch (error) {
      console.error('Error decoding token on login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, adminToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
