
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from '@/lib/shield';

interface ShieldTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const ShieldText: React.FC<ShieldTextProps> = ({ text, className, delay = 0 }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTextRef = useRef<string>(text);

  // فك التشفير وحساب النص النهائي
  const unveiledText = useMemo(() => {
    if (!text) return '';
    if (typeof text === 'string' && text.startsWith('f_shield_v1:')) {
      return Shield.unveil(text);
    }
    return String(text);
  }, [text]);

  // نص التمويه البصري
  const scrambledPlaceholder = useMemo(() => {
    return Shield.scramble(unveiledText);
  }, [unveiledText]);

  useEffect(() => {
    // إذا تغير النص الفعلي، أعد ضبط الحالة
    if (lastTextRef.current !== text) {
      setIsRevealed(false);
      lastTextRef.current = text;
    }

    if (!unveiledText) {
      setIsRevealed(true);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsRevealed(true);
    }, 300 + (delay * 1000));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [unveiledText, delay, text]);

  if (!unveiledText) return null;

  return (
    <span className={className}>
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.span
            key="scrambled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-emerald-500/20 font-mono select-none blur-[1px]"
          >
            {scrambledPlaceholder.slice(0, 15)}
          </motion.span>
        ) : (
          <motion.span
            key="revealed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline"
          >
            {unveiledText}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default React.memo(ShieldText);
