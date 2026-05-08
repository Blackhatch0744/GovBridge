'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

/* ═══════════════════════════════════════════════════
   PAGE TRANSITION — Cinematic
   Elegant route transitions with:
   - Opacity fade
   - Slight translateY shift
   - Blur in/out for depth
   - Smooth continuity between pages
   ═══════════════════════════════════════════════════ */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(3px)',
  },
};

const pageTransition = {
  duration: 0.5,
  ease: [0.16, 1, 0.3, 1],
};

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
