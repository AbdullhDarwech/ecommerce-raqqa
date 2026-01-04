
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Lock, Eye, UserCheck, 
  Database, Share2, ArrowRight, Sparkles, 
  FileText, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const MotionDiv = motion.div as any;

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen pb-24 selection:bg-emerald-600 selection:text-white overflow-hidden">
      
      {/* 1. CINEMATIC HEADER */}
      <section className="relative pt-40 pb-24 bg-emerald-950 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-400/10 blur-[120px] rounded-full animate-pulse delay-700" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-amber-400 text-[10px] font-black tracking-[0.4em] uppercase mb-8 shadow-2xl backdrop-blur-md"
          >
            <ShieldCheck size={14} className="animate-bounce" /> Furato Security Protocol
          </MotionDiv>
          
          <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-8">
            ميثاق <span className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-200 to-emerald-500">الخصوصية</span> السيادي
          </h1>
          
          <p className="text-emerald-50/60 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed">
            نحن في فوراتو نعتبر بياناتك مقتنيات ثمينة، نلتزم بحمايتها وفق أعلى معايير التشفير العالمية لضمان تجربة تسوق آمنة ونخبوية.
          </p>
        </div>
        
        {/* Transition Wave */}
        <div className="absolute -bottom-1 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* 2. CORE POLICIES */}
      <div className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          <PolicyCard 
            icon={<Database className="text-emerald-600" />}
            title="البيانات التي نجمعها"
            description="نقوم بجمع البيانات الضرورية فقط لتقديم خدمة سيادية: الاسم الكامل، البريد الإلكتروني المهني، رقم الهاتف السوري، وعنوان التوصيل الموثق لإتمام طلباتك بدقة."
          />

          <PolicyCard 
            icon={<Eye className="text-amber-500" />}
            title="بروتوكول استخدام البيانات"
            description="تستخدم بياناتك حصرياً لمعالجة عمليات الاقتناء، تحسين كفاءة المنصة الرقمية، وإرسال دعوات خاصة للعروض والمزادات السرية التي تهم الصفوة."
          />

          <PolicyCard 
            icon={<Lock className="text-teal-600" />}
            title="حماية المقتنيات الرقمية"
            description="نستخدم تقنيات تشفير SSL متطورة وجدران حماية سيادية لحماية هويتك الرقمية، مع إجراء فحوصات دورية لضمان عدم تعرض بياناتك لأي مخاطر خارجية."
          />

          <PolicyCard 
            icon={<Share2 className="text-cyan-600" />}
            title="ميثاق عدم المشاركة"
            description="نحن لا نتاجر ببياناتك. لن يتم مشاركة أي معلومة تخصك مع أطراف ثالثة خارج بروتوكول التوصيل الخاص بنا إلا بموافقة صريحة ومباشرة منك."
          />

        </div>
      </div>

      {/* 3. ADDITIONAL DETAILS */}
      <section className="py-24 container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-stone-50 rounded-[4rem] p-10 md:p-20 border border-stone-100 shadow-inner relative overflow-hidden">
          <div className="relative z-10 space-y-12">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-emerald-950 text-white rounded-2xl flex items-center justify-center shadow-2xl">
                <FileText size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-emerald-950 tracking-tight">إدارة تفضيلات الخصوصية</h2>
                <p className="text-stone-400 text-xs font-black uppercase tracking-widest mt-1">حقوق العضوية النخبوية</p>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-stone-600 leading-relaxed font-medium">
                بصفتك عضواً في "فوراتو"، يحق لك دائماً الوصول إلى سجل بياناتك، تعديله، أو طلب إزالته نهائياً من سجلاتنا السيادية. نحن نؤمن بأن السيادة على البيانات هي أساس الثقة الرقمية.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ListItem text="تحديث البيانات اللحظي من لوحة التحكم" />
                <ListItem text="إدارة اشتراكات النشرات النخبوية" />
                <ListItem text="طلب إتلاف السجلات الرقمية" />
                <ListItem text="الحصول على نسخة من ميثاق الأمان" />
              </div>
            </div>

            <div className="pt-10 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-8">
               <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">تاريخ آخر تحديث: مارس 2024</p>
               <Link 
                href="/" 
                className="group flex items-center gap-3 px-8 py-4 bg-emerald-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-800 transition-all active:scale-95"
               >
                 العودة إلى المعرض <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>
          
          {/* Subtle Decorative Icon */}
          <Sparkles className="absolute -bottom-10 -left-10 text-emerald-100 opacity-20" size={240} />
        </div>
      </section>

    </div>
  );
}

function PolicyCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <MotionDiv 
      whileHover={{ y: -8 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-10 rounded-[3rem] border border-emerald-50 shadow-[0_15px_40px_-15px_rgba(6,78,59,0.08)] space-y-6 group transition-all duration-500 hover:shadow-2xl"
    >
      <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
        {React.cloneElement(icon as React.ReactElement, { size: 32, strokeWidth: 1.5 })}
      </div>
      <h3 className="text-2xl font-black text-emerald-950 tracking-tight">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed font-medium">
        {description}
      </p>
    </MotionDiv>
  );
}

function ListItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-emerald-900 font-bold text-xs">
      <CheckCircle2 size={16} className="text-amber-500" />
      <span>{text}</span>
    </div>
  );
}
