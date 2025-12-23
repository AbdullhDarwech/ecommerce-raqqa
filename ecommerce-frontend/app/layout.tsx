import { AuthProvider } from '@/lib/auth';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Container from '@/components/Container';
import './globals.css';

export const metadata = {
  title: 'سوق الرقة - السوق الإلكتروني الأول في الرقة',
  description: 'تسوق منتجات محلية وعالمية بأسعار تنافسية في سوق الرقة',
  keywords: 'سوق الرقة, تسوق إلكتروني, منتجات محلية, سوريا',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.ico" />
      </head>

      <body className="bg-gray-50 text-gray-900 font-sans selection:bg-emerald-200 selection:text-emerald-900">
        <AuthProvider>
          <CartProvider>
            {/* Header is now global */}
            <Header />
            
            {/* Global Cart Drawer */}
            <CartDrawer />

            <main className="min-h-screen pt-10 md:pt-14">
              <Container>
                {children}
              </Container>
            </main>

            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}