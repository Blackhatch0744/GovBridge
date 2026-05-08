'use client';

import { motion } from 'framer-motion';
import Counter from '@/components/motion/Counter';

/* ═══════════════════════════════════════════════════
   READINESS RING — Cinematic
   Animated SVG stroke with ambient glow pulse,
   tick marks at intervals, blur-in counter
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export default function ReadinessRing({ score = 0, size = 120 }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 75 ? '#1A5C38' : score >= 50 ? '#92600A' : '#8B1A1A';

  /* Tick mark positions */
  const ticks = [25, 50, 75];
  const tickR = r + 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-[-6px] rounded-full"
        animate={{
          boxShadow: [
            `0 0 15px ${color}10`,
            `0 0 30px ${color}20`,
            `0 0 15px ${color}10`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        {/* Background ring */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E8E2DA" strokeWidth="8" />

        {/* Tick marks */}
        {ticks.map((pct) => {
          const angle = (pct / 100) * 2 * Math.PI;
          const cx = size / 2 + tickR * Math.cos(angle);
          const cy = size / 2 + tickR * Math.sin(angle);
          return (
            <motion.circle
              key={pct}
              cx={cx} cy={cy} r="2"
              fill="#E8E2DA"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ delay: 0.5 + pct * 0.005, duration: 0.3 }}
            />
          );
        })}

        {/* Score arc */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - score / 100) }}
          transition={{ duration: 1.5, delay: 0.3, ease }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="font-mono font-semibold text-text-primary"
          style={{ fontSize: size > 100 ? 32 : 18, color }}
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.8, ease }}
        >
          <Counter to={score} suffix="%" duration={1.5} />
        </motion.span>
        <span className="text-12 text-text-secondary mt-0.5">Readiness</span>
      </div>
    </div>
  );
}
