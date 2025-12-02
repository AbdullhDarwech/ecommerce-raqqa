import { AuthProvider } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="bg-gray-50 text-gray-900">
        <AuthProvider>
          <Header />

          {/* هنا الكونتينر الأساسي للمشروع */}
          <main className="min-h-screen py-6">
            <Container>
              {children}
            </Container>
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
