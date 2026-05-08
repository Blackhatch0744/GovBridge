'use client';

import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════
   BLUR REVEAL — Performance Optimized
   On mobile/reduced: opacity only, no blur.
   Uses transform + opacity only (GPU composited).
   ═══════════════════════════════════════════════════ */

export default function BlurReveal({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  style = {},
  direction = 'up',
  blur = 8,
  distance = 20,
  once = true,
  margin = '-10%',
  as = 'div',
}) {
  const reduced = useReducedMotion();

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  const offset = reduced ? {} : (directionMap[direction] || directionMap.up);
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial={{
        opacity: 0,
        ...(reduced ? {} : { filter: `blur(${blur}px)` }),
        ...offset,
      }}
      whileInView={{
        opacity: 1,
        ...(reduced ? {} : { filter: 'blur(0px)' }),
        x: 0,
        y: 0,
      }}
      viewport={{ once, margin }}
      transition={{
        duration: reduced ? 0.25 : duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={{ ...style, willChange: 'transform, opacity' }}
    >
      {children}
    </Component>
  );
}
