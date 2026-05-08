'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════
   MOTION WRAPPER — Performance Optimized
   Pseudo-3D tilt on hover, depth shadows.
   Disabled on mobile/reduced — renders flat div.
   Transform-only with will-change.
   ═══════════════════════════════════════════════════ */

export default function MotionWrapper({
  children,
  className = '',
  style = {},
  tilt = true,
  tiltMax = 4,
  liftOnHover = true,
  liftAmount = -3,
  perspective = 1200,
  shadowOnHover = true,
  onClick,
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.8 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springScale = useSpring(1, { stiffness: 300, damping: 25 });
  const springY = useSpring(0, { stiffness: 300, damping: 25 });

  const handleMouseMove = (e) => {
    if (reduced || !tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const percentX = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2));
    const percentY = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2));
    rotateX.set(-percentY * tiltMax);
    rotateY.set(percentX * tiltMax);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (liftOnHover) {
      springScale.set(1.02);
      springY.set(liftAmount);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    springScale.set(1);
    springY.set(0);
  };

  if (reduced) {
    return (
      <div className={className} style={style} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ perspective: `${perspective}px` }} className={className}>
      <motion.div
        ref={ref}
        style={{
          ...style,
          rotateX: tilt ? springRotateX : 0,
          rotateY: tilt ? springRotateY : 0,
          scale: springScale,
          y: springY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          boxShadow: isHovered && shadowOnHover
            ? '0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {children}
      </motion.div>
    </div>
  );
}
