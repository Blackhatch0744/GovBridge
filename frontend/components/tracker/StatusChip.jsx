'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   STATUS CHIP — Polished
   Subtle hover scale, funded star animation
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

function StatusChip({ status }) {
  const styles = {
    draft: { bg: '#F5F2EE', color: '#6B6560' },
    submitted: { bg: '#E3F2FD', color: '#1565C0' },
    under_review: { bg: '#FFF8E1', color: '#92600A' },
    approved: { bg: '#E8F5E9', color: '#1A5C38' },
    rejected: { bg: '#FFEBEE', color: '#8B1A1A' },
    funded: { bg: '#E8F5E9', color: '#1A5C38' },
  };

  const s = styles[status] || styles.draft;
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <motion.span
      className="inline-flex items-center gap-1.5 text-12 font-medium px-3 py-1.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.color }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2, ease }}
    >
      {status === 'funded' && (
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 1.5, delay: 0.5, repeat: 1, ease: 'easeInOut' }}
        >
          ★
        </motion.span>
      )}
      {label}
    </motion.span>
  );
}

export default memo(StatusChip);
