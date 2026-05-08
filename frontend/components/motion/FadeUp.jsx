'use client';

import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════
   FADE UP — Performance Optimized
   Transform + opacity only. will-change set.
   rootMargin at -10% for seamless trigger.
   ═══════════════════════════════════════════════════ */

export default function FadeUp({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  blur = false,
  scale = false,
  distance = 40,
  once = true,
  margin = '-10%',
}) {
  const reduced = useReducedMotion();

  const initial = {
    opacity: 0,
    y: reduced ? 0 : distance,
    ...(blur && !reduced ? { filter: 'blur(6px)' } : {}),
    ...(scale && !reduced ? { scale: 0.97 } : {}),
  };

  const animate = {
    opacity: 1,
    y: 0,
    ...(blur && !reduced ? { filter: 'blur(0px)' } : {}),
    ...(scale && !reduced ? { scale: 1 } : {}),
  };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once, margin }}
      transition={{
        duration: reduced ? 0.25 : duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
