import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">سوق الرقة</h3>
          <p className="text-gray-300">أفضل السوق الإلكتروني في الرقة، نقدم منتجات محلية وعالمية بأسعار تنافسية.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">روابط سريعة</h3>
          <ul className="space-y-2">
            <li><Link href="/categories" className="hover:text-syrazo-yellow transition">الفئات</Link></li>
            <li><Link href="/products" className="hover:text-syrazo-yellow transition">المنتجات</Link></li>
            <li><Link href="/about" className="hover:text-syrazo-yellow transition">عن الشركة</Link></li>
            <li><Link href="/contact" className="hover:text-syrazo-yellow transition">اتصل بنا</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">الدعم</h3>
          <div className="flex items-center mb-2">
            <Phone size={16} className="mr-2" />
            <span>0930904315</span>
          </div>
          <div className="flex items-center mb-2">
            <Mail size={16} className="mr-2" />
            <span>info@raqamarket.com</span>
          </div>
          <div className="flex items-center">
            <MapPin size={16} className="mr-2" />
            <span>الرقة، سوريا</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">تابعنا</h3>
          <div className="flex space-x-4">
            <Facebook size={24} className="hover:text-syrazo-yellow transition cursor-pointer" />
            <Instagram size={24} className="hover:text-syrazo-yellow transition cursor-pointer" />
            <Twitter size={24} className="hover:text-syrazo-yellow transition cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center">
        <p>&copy; 2023 سوق الرقة - جميع الحقوق محفوظة. تصميم مشابه لـ syrazo.com</p>
      </div>
    </footer>
  );
}