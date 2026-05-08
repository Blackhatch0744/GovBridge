'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   SCROLL PROGRESS LINE
   Thin cinematic progress bar fixed to top of viewport.
   Shows page scroll position with smooth spring physics.
   ═══════════════════════════════════════════════════ */

export default function ScrollProgressLine({
  color = '#111111',
  height = 2,
  zIndex = 9999,
  spring = true,
}) {
  const { scrollYProgress } = useScroll();

  const scaleX = spring
    ? useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
      })
    : scrollYProgress;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        background: color,
        transformOrigin: '0%',
        scaleX,
        zIndex,
        willChange: 'transform',
      }}
    />
  );
}
