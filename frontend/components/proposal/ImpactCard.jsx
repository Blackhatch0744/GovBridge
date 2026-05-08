'use client';

import { motion } from 'framer-motion';
import BlurReveal from '@/components/motion/BlurReveal';

/* ═══════════════════════════════════════════════════
   IMPACT CARD — Cinematic Quote
   Soft glow edge, animated quote mark, highlighted feel
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export default function ImpactCard({ impact }) {
  if (!impact) return null;

  return (
    <BlurReveal blur={6} distance={20} duration={0.6}>
      <div
        className="p-6 rounded-2xl mt-6 relative overflow-hidden"
        style={{
          backgroundColor: '#F5F2EE',
          border: '1px solid #E8E2DA',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        {/* Soft left edge glow */}
        <motion.div
          className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
          style={{ backgroundColor: '#D4C5B0' }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          style={{ transformOrigin: 'top', backgroundColor: '#D4C5B0' }}
        />

        {/* Animated quote mark */}
        <motion.span
          className="absolute top-3 right-6 text-[64px] font-serif leading-none pointer-events-none select-none"
          style={{ color: '#D4C5B0', opacity: 0.3 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5, ease }}
        >
          &ldquo;
        </motion.span>

        <p className="text-12 font-medium text-text-secondary uppercase tracking-wider mb-3 pl-4">Impact Statement</p>
        <motion.p
          className="text-16 text-text-primary leading-relaxed italic pl-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
        >
          &ldquo;{impact}&rdquo;
        </motion.p>
      </div>
    </BlurReveal>
  );
}
