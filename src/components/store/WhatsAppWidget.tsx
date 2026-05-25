'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppWidget() {
  const WHATSAPP_PHONE = '8801711234567';
  const DEFAULT_MESSAGE =
    'Hello KANSO, I am interested in your luxury Japandi curated stoneware and furniture collections. I would love to connect with a curator!';

  const handleWhatsAppRedirect = () => {
    const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed bottom-[4.5rem] left-4 z-30 md:bottom-8 md:left-auto md:right-8 md:z-40 group animate-fade-up font-sans">
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-charcoal text-sand text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-sand/10 shadow-md opacity-0 scale-90 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 whitespace-nowrap hidden md:block">
        Chat with Curator
      </div>

      <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75 pointer-events-none" />

      <button
        type="button"
        onClick={handleWhatsAppRedirect}
        className="relative w-12 h-12 md:w-13 md:h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-sand flex items-center justify-center shadow-[0_12px_30px_rgba(16,185,129,0.25)] hover:shadow-[0_16px_40px_rgba(16,185,129,0.35)] transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-emerald-500/20 z-10"
        aria-label="Direct WhatsApp Contact"
      >
        <MessageCircle className="w-6 h-6 fill-current animate-pulse" />
      </button>
    </div>
  );
}

export default WhatsAppWidget;
