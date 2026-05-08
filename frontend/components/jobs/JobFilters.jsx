'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════
   JOB FILTERS — Polished
   Smooth focus glow, subtle hover on fields
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export default function JobFilters({ onFilter }) {
  const [location, setLocation] = useState('');
  const [minPay, setMinPay] = useState('');

  const handle = (field, value) => {
    const s = { location, minPay, [field]: value };
    if (field === 'location') setLocation(value);
    if (field === 'minPay') setMinPay(value);
    onFilter(s);
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3, ease }}
      >
        <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">Location</label>
        <input type="text" value={location} onChange={(e) => handle('location', e.target.value)}
          className="input-field text-14" placeholder="Filter by location..." />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.3, ease }}
      >
        <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">Min Pay</label>
        <select value={minPay} onChange={(e) => handle('minPay', e.target.value)}
          className="input-field text-14" style={{ cursor: 'pointer' }}>
          <option value="">Any Pay</option>
          <option value="10000">₹10k+</option>
          <option value="15000">₹15k+</option>
          <option value="20000">₹20k+</option>
        </select>
      </motion.div>
    </div>
  );
}
