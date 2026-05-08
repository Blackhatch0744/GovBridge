'use client';

import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════
   CINEMATIC REVEAL — Performance Optimized
   Degrades to simple opacity fade on mobile/reduced.
   Uses transform + opacity only (GPU composited).
   ═══════════════════════════════════════════════════ */

const presets = {
  default: {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)', scale: 0.97 },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
  },
  gentle: {
    hidden: { opacity: 0, y: 20, filter: 'blur(4px)', scale: 0.99 },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
  },
  dramatic: {
    hidden: { opacity: 0, y: 60, filter: 'blur(12px)', scale: 0.94 },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -40, filter: 'blur(6px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  slideRight: {
    hidden: { opacity: 0, x: 40, filter: 'blur(6px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.9, filter: 'blur(6px)' },
    visible: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  },
};

const reducedVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function CinematicReveal({
  children,
  preset = 'default',
  delay = 0,
  duration = 0.7,
  className = '',
  once = true,
  margin = '-10%',
  style = {},
}) {
  const reduced = useReducedMotion();
  const variants = reduced ? reducedVariants : (presets[preset] || presets.default);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      transition={{
        duration: reduced ? 0.3 : duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={{ ...style, willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
