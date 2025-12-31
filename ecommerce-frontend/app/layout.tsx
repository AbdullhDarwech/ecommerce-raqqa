
import React, { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import './globals.css';

export const metadata = {
  title: 'Furato Elite - تجربة التسوق السيادية',
  description: 'منصتكم الرائدة لتسوق حصري يجمع بين الفخامة الزمردية والتقنية العالمية في قلب الرقة.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2225%22 fill=%22%2310b981%22/><text x=%2250%25%22 y=%2255%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22sans-serif%22 font-weight=%22900%22 font-size=%2260%22>F</text></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const inlineStyles = `
    :root {
      --font-primary: 'IBM Plex Sans Arabic', sans-serif;
    }
    body {
      font-family: var(--font-primary);
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      background-color: #ffffff;
      color: #064e3b;
    }
    h1, h2, h3, h4, h5, h6 {
      letter-spacing: -0.02em;
    }
    ::selection {
      background-color: #10b981;
      color: #ffffff;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 5px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f0fdf4;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #10b981;
      border-radius: 10px;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `;

  return (
    <html lang="ar" dir="rtl" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2225%22 fill=%22%2310b981%22/><text x=%2250%25%22 y=%2255%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22white%22 font-family=%22sans-serif%22 font-weight=%22900%22 font-size=%2260%22>F</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />
      </head>

      <body className="bg-white text-emerald-950 custom-scrollbar">
        <AuthProvider>
          <CartProvider>
            <Header />
            <CartDrawer />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}