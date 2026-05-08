'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════
   PARALLAX LAYER — Performance Optimized
   Disabled on mobile/reduced — renders children only.
   Uses transform only (GPU composited).
   ═══════════════════════════════════════════════════ */

export default function ParallaxLayer({
  children,
  speed = -0.15,
  className = '',
  style = {},
  axis = 'y',
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const range = speed * 100;
  const yTransform = useTransform(scrollYProgress, [0, 1], [`${range}px`, `${-range}px`]);
  const xTransform = useTransform(scrollYProgress, [0, 1], [`${range}px`, `${-range}px`]);

  if (reduced) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{
        ...style,
        [axis === 'y' ? 'y' : 'x']: axis === 'y' ? yTransform : xTransform,
        willChange: 'transform',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
