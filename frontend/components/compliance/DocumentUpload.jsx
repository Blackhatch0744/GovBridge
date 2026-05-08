'use client';

import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   DOCUMENT UPLOAD — Cinematic Toggle
   Spring scale on toggle, staggered chip entry
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export default function DocumentUpload({ selected = [], options = [], onToggle }) {
  return (
    <div>
      <p className="text-14 font-medium text-text-primary mb-4">Select documents you have</p>
      <div className="flex flex-wrap gap-2">
        {options.map((doc, i) => {
          const active = selected.includes(doc);
          return (
            <motion.button
              key={doc}
              onClick={() => onToggle(doc)}
              className="text-14 px-4 py-2 rounded-full transition-colors duration-200"
              style={{
                backgroundColor: active ? '#111111' : '#F5F2EE',
                color: active ? '#FFFFFF' : '#6B6560',
                border: active ? '1px solid #111111' : '1px solid #E8E2DA',
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3, ease }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
            >
              {active ? '✓ ' : ''}{doc}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
