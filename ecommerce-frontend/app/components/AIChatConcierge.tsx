
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, X, Send, Sparkles, ShoppingBag, 
  MessageCircle, Loader2, Minimize2, Maximize2 
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const MotionDiv = motion.div as any;

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIChatConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'مرحباً بك في عالم فوراتو النخبوي. أنا مساعدك الشخصي الذكي، كيف يمكنني مساعدتك اليوم في اختيار المقتنى المثالي؟' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // Initialize AI right before use to ensure most up-to-date key if applicable
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `أنت مساعد تسوق ذكي نخبوي لمتجر "فوراتو" (Furato Excellence) في مدينة الرقة. 
          شخصيتك: لبقة، رسمية، فاخرة، وتساعد العملاء في اختيار المنتجات (إلكترونيات، أزياء، ساعات، عطور).
          لغتك الأساسية هي العربية بلهجة مهذبة وراقية.
          قدم ترشيحات بناءً على رغبات المستخدم وادعه دائماً لاستكشاف المعرض الشامل.
          لا تذكر أبداً أنك ذكاء اصطناعي إلا إذا سئلت، تظاهر بأنك خبير تسوق حقيقي من فريق فوراتو.`,
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
        }
      });

      const modelText = response.text || 'عذراً، حدث خطأ تقني بسيط في الاتصال بخوادم الذكاء الاصطناعي. كيف يمكنني مساعدتك بطريقة أخرى؟';
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);
    } catch (error) {
      console.error('AI Concierge Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'أعتذر، يبدو أن هناك ضغطاً كبيراً على خدماتنا الآن. هل يمكنك المحاولة مرة أخرى لاحقاً؟' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-12 right-8 lg:bottom-16 lg:right-16 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[90vw] sm:w-[420px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(6,78,59,0.3)] border border-emerald-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-emerald-950 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg relative">
                  <Bot size={24} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-emerald-950 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight">مساعد فوراتو الذكي</h3>
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active Concierge</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-stone-50/50">
              {messages.map((msg, i) => (
                <MotionDiv
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} gap-3`}
                >
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 bg-stone-200 rounded-full flex items-center justify-center shrink-0">
                      <ShoppingBag size={14} className="text-stone-500" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-white text-emerald-950 border border-emerald-50 rounded-tr-none' 
                      : 'bg-emerald-600 text-white rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 bg-emerald-950 rounded-full flex items-center justify-center shrink-0">
                      <Sparkles size={14} className="text-emerald-400" />
                    </div>
                  )}
                </MotionDiv>
              ))}
              {isTyping && (
                <div className="flex justify-end gap-3">
                  <div className="bg-emerald-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-emerald-50">
              <div className="relative group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="كيف يمكنني مساعدتك..."
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-4 pr-12 pl-4 text-xs font-bold focus:outline-none focus:border-emerald-500/20 focus:bg-white transition-all shadow-inner"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[8px] text-stone-400 font-bold text-center mt-3 uppercase tracking-widest">Powered by Furato Gemini AI</p>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-[2.2rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group overflow-hidden ${
          isOpen ? 'bg-emerald-950' : 'bg-emerald-600'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <MotionDiv key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={32} className="text-white" />
            </MotionDiv>
          ) : (
            <MotionDiv key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot size={32} className="text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                <Sparkles size={12} className="text-white animate-pulse" />
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
