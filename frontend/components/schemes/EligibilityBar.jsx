'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   ELIGIBILITY BAR — Cinematic
   Animated fill with glow trail, blur-in score number
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

function EligibilityBar({ score = 0 }) {
  const color = score >= 75 ? '#1A5C38' : score >= 50 ? '#92600A' : '#8B1A1A';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-12 text-text-secondary">Eligibility</span>
        <motion.span
          className="text-14 font-mono font-semibold"
          style={{ color }}
          initial={{ opacity: 0, filter: 'blur(4px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
        >
          {score}%
        </motion.span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden relative" style={{ backgroundColor: '#F5F2EE' }}>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: score / 100 }}
          transition={{ duration: 1.2, delay: 0.2, ease }}
          className="h-full rounded-full relative"
          style={{ backgroundColor: color, transformOrigin: 'left', width: '100%', willChange: 'transform' }}
        >
          {/* Subtle glow trail */}
          <motion.div
            className="absolute right-0 top-[-2px] bottom-[-2px] w-4 rounded-full"
            style={{
              background: `radial-gradient(circle, ${color}40, transparent)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0.4] }}
            transition={{ duration: 1.2, delay: 0.8, ease }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default memo(EligibilityBar);

