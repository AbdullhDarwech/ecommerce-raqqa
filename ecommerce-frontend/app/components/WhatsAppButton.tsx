'use client';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function WhatsAppButton({ phone }: { phone: string }) {
  return (
    <Link
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed left-4 bottom-4 z-50 w-14 h-14 bg-green-500 rounded-full 
        flex items-center justify-center shadow-lg hover:bg-green-600 
        transition transform animate-bounce hover:animate-spin
      "
    >
      <Phone size={28} className="text-white" />
    </Link>
  );
}
