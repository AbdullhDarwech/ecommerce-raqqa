'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <span className="font-bold text-2xl text-white">Furato</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6">
              سوق الرقة الإلكتروني الأول. نجمع بين الأصالة والتطور لتقديم أفضل المنتجات المحلية والعالمية بأسعار تنافسية وخدمة توصيل سريعة.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Facebook size={20} />} />
              <SocialLink href="#" icon={<Instagram size={20} />} />
              <SocialLink href="#" icon={<Twitter size={20} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">روابط سريعة</h3>
            <ul className="space-y-4">
              <FooterLink href="/products" label="جميع المنتجات" />
              <FooterLink href="/categories" label="الفئات" />
              <FooterLink href="/offers" label="العروض الخاصة" />
              <FooterLink href="/contact" label="اتصل بنا" />
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">خدمة العملاء</h3>
            <ul className="space-y-4">
              <FooterLink href="/profile" label="حسابي" />
              <FooterLink href="/cart" label="سلة المشتريات" />
              <FooterLink href="/wishlist" label="المفضلة" />
              <FooterLink href="/privacy" label="سياسة الخصوصية" />
              <FooterLink href="/terms" label="الشروط والأحكام" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-emerald-500 shrink-0 mt-1" size={20} />
                <span>سوريا، الرقة، شارع التل</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-emerald-500 shrink-0" size={20} />
                <span dir="ltr">+963 930 904 315</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-emerald-500 shrink-0" size={20} />
                <span>info@Furato.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} سوق الرقة (Furato). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1">
            <span>صنع بكل</span>
            <Heart size={14} className="text-rose-500 fill-current" />
            <span>لأهل الرقة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-gray-400 hover:text-emerald-500 transition-colors">
        {label}
      </Link>
    </li>
  );
}