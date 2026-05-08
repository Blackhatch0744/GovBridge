'use client';

import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   MISSING DOCS LIST — Cinematic
   Staggered chip reveals, shake effect on missing
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export default function MissingDocsList({ missing = [], matching = [] }) {
  return (
    <div className="space-y-4">
      {missing.length > 0 && (
        <div>
          <p className="text-12 text-text-secondary font-medium uppercase tracking-wider mb-2">Missing</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((doc, i) => (
              <motion.span
                key={i}
                className="text-12 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: '#FFEBEE', color: '#8B1A1A' }}
                initial={{ opacity: 0, x: -10, scale: 0.9 }}
                animate={{ opacity: 1, x: [0, -3, 3, -2, 0], scale: 1 }}
                transition={{
                  opacity: { delay: i * 0.06, duration: 0.3, ease },
                  x: { delay: i * 0.06 + 0.3, duration: 0.4, ease },
                  scale: { delay: i * 0.06, duration: 0.3, ease },
                }}
              >
                ✕ {doc}
              </motion.span>
            ))}
          </div>
        </div>
      )}
      {matching.length > 0 && (
        <div>
          <p className="text-12 text-text-secondary font-medium uppercase tracking-wider mb-2">Verified</p>
          <div className="flex flex-wrap gap-2">
            {matching.map((doc, i) => (
              <motion.span
                key={i}
                className="text-12 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: '#E8F5E9', color: '#1A5C38' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.3, ease }}
              >
                ✓ {doc}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
