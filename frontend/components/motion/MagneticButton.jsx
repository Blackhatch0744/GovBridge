'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════
   MAGNETIC BUTTON — Performance Optimized
   On mobile/reduced: keeps scale interaction only,
   disables cursor tracking. Transform-only.
   ═══════════════════════════════════════════════════ */

export default function MagneticButton({
  children,
  className = '',
  style = {},
  strength = 0.3,
  radius = 6,
  onClick,
  ...props
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 20, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const scale = useSpring(1, { stiffness: 400, damping: 25 });

  const handleMouseMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
    x.set(Math.max(-radius, Math.min(radius, dx)));
    y.set(Math.max(-radius, Math.min(radius, dy)));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.03);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    scale.set(1);
  };

  const handleMouseDown = () => scale.set(0.97);
  const handleMouseUp = () => scale.set(isHovered ? 1.03 : 1);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        x: reduced ? 0 : springX,
        y: reduced ? 0 : springY,
        scale,
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={() => scale.set(0.97)}
      onTouchEnd={() => scale.set(1)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}
