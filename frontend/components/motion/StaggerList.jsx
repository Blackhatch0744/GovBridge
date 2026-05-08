'use client';

import { motion } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════
   STAGGER LIST — Performance Optimized
   rootMargin: -10% for seamless trigger.
   Reduced motion: no blur/scale, simple fade only.
   will-change on items.
   ═══════════════════════════════════════════════════ */

const createContainerVariants = (staggerDelay = 0.08) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
    },
  },
});

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 40,
    filter: 'blur(4px)',
    scale: 0.97,
  },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const staggerItemReduced = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const staggerItemHorizontal = {
  hidden: {
    opacity: 0,
    x: 30,
    filter: 'blur(4px)',
  },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function StaggerList({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.08,
  direction = 'vertical',
  once = true,
  margin = '0px 0px -10% 0px',
}) {
  const containerVariants = createContainerVariants(staggerDelay);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin }}
      className={className}
      transition={{ delayChildren: delay }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '', direction = 'vertical' }) {
  const reduced = useReducedMotion();

  const variants = reduced
    ? staggerItemReduced
    : direction === 'horizontal'
      ? staggerItemHorizontal
      : staggerItem;

  return (
    <motion.div
      variants={variants}
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}
