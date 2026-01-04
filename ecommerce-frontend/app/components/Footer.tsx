
'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-20">
          
          {/* Brand Info */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl">
                F
              </div>
              <span className="font-black text-3xl text-white tracking-tighter">Furato</span>
            </Link>
            <p className="text-slate-500 leading-relaxed font-medium text-lg italic">
              "نحن لا نبيع المنتجات فحسب، بل نصيغ نمطاً جديداً من الرفاهية الرقمية لقلب مدينتنا الرقة."
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon={<Facebook size={20} />} />
              <SocialLink href="#" icon={<Instagram size={20} />} />
              <SocialLink href="#" icon={<Twitter size={20} />} />
            </div>
          </div>

          {/* Service Links */}
          <div className="space-y-8">
            <h3 className="text-white font-black text-sm uppercase tracking-[0.3em]">عالمنا</h3>
            <ul className="space-y-4">
              <FooterLink href="/products" label="مجموعة المقتنيات" />
              <FooterLink href="/stores" label="مراكزنا الحصرية" />
              <FooterLink href="/offers" label="مزايا خاصة" />
              <FooterLink href="/contact" label="قنوات التواصل" />
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-8">
            <h3 className="text-white font-black text-sm uppercase tracking-[0.3em]">المساعدة</h3>
            <ul className="space-y-4">
              <FooterLink href="/profile" label="الحساب الشخصي" />
              <FooterLink href="/cart" label="حقيبة التسوق" />
              <FooterLink href="/privacy" label="ميثاق الخصوصية" />
              <FooterLink href="/terms" label="بروتوكول الخدمة" />
            </ul>
          </div>

          {/* Concierge */}
          <div className="space-y-8">
            <h3 className="text-white font-black text-sm uppercase tracking-[0.3em]">المقر</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-emerald-500 shrink-0 mt-1" size={20} />
                <span className="font-medium">الرقة، سوريا - المركز الإداري</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-emerald-500 shrink-0" size={20} />
                <span className="font-medium" dir="ltr">+963 930 904 315</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-emerald-500 shrink-0" size={20} />
                <span className="font-medium">concierge@furato.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} Furato Elite Shopping. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-2">
            <span>صمم بشغف لمدينتنا</span>
            <Heart size={14} className="text-emerald-500 fill-current" />
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
      className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white transition-all duration-500 shadow-xl"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link href={href} className="text-slate-500 font-bold hover:text-emerald-500 hover:translate-x-2 transition-all block">
        {label}
      </Link>
    </li>
  );
}
