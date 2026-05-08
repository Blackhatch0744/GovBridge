'use client';

import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════
   FLOATING ELEMENT — Performance Optimized
   Disabled on mobile/reduced — renders children only.
   Uses transform only (GPU composited).
   ═══════════════════════════════════════════════════ */

export default function FloatingElement({
  children,
  className = '',
  style = {},
  amplitude = 8,
  duration = 4,
  delay = 0,
  rotateAmplitude = 1.5,
  mouseInfluence = 0,
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    if (reduced || mouseInfluence <= 0) return;

    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) * mouseInfluence * 0.02);
      mouseY.set((e.clientY - centerY) * mouseInfluence * 0.02);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseInfluence, mouseX, mouseY, reduced]);

  if (reduced) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        x: mouseInfluence > 0 ? springX : 0,
        y: mouseInfluence > 0 ? springY : 0,
        willChange: 'transform',
      }}
      animate={{
        y: [0, -amplitude, 0, amplitude * 0.5, 0],
        rotate: [0, rotateAmplitude, 0, -rotateAmplitude * 0.5, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}
