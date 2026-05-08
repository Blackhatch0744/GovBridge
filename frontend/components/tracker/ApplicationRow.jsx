'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import StatusChip from './StatusChip';

/* ═══════════════════════════════════════════════════
   APPLICATION ROW — Cinematic
   Hover lift, layout animation for selection,
   smooth background transitions
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

function ApplicationRow({ app, onSelect, isSelected }) {
  return (
    <motion.button
      onClick={() => onSelect?.(app)}
      className="w-full flex items-center justify-between p-5 rounded-xl text-left relative"
      style={{
        backgroundColor: isSelected ? '#F5F2EE' : '#FFFFFF',
        border: isSelected ? '1px solid #111111' : '1px solid #E8E2DA',
      }}
      whileHover={{
        y: -2,
        boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
      }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.25, ease }}
      layout
    >
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
          style={{ backgroundColor: '#111111' }}
          layoutId="tracker-selected"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        />
      )}

      <div className="flex-1">
        <p className="text-16 font-medium text-text-primary">{app.scheme_name}</p>
        <p className="text-12 text-text-secondary mt-0.5">
          {app.submitted_at ? `Submitted ${app.submitted_at}` : 'Not submitted'}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-14 font-mono font-medium" style={{ color: '#1A5C38' }}>
          {app.readiness_score}%
        </span>
        <StatusChip status={app.status} />
      </div>
    </motion.button>
  );
}

export default memo(ApplicationRow);
