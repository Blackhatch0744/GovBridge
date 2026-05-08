'use client';

import { motion } from 'framer-motion';
import { mockSchemes, documentTypes } from '@/lib/mockData';
import MagneticButton from '@/components/motion/MagneticButton';

/* ═══════════════════════════════════════════════════
   PROPOSAL EDITOR — Polished
   Depth layering, staggered doc chips, magnetic buttons
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export default function ProposalEditor({ onGenerate, onImpact, loading, impactLoading, hasProposal, hasImpact }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">Select Scheme</label>
        <select id="proposal-scheme" className="input-field text-14" style={{ cursor: 'pointer' }}>
          {mockSchemes.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
        </select>
      </div>
      <div>
        <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">Documents</label>
        <div className="flex flex-wrap gap-2">
          {documentTypes.slice(0, 6).map((d, i) => (
            <motion.span
              key={d}
              className="text-12 px-3 py-1.5 rounded-full"
              style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 + 0.1, duration: 0.3, ease }}
            >
              ✓ {d}
            </motion.span>
          ))}
        </div>
      </div>

      <MagneticButton strength={0.15} radius={4} className="w-full">
        <button
          onClick={onGenerate}
          disabled={loading || hasProposal}
          className="btn-primary w-full py-4 text-14"
        >
          {loading ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Generating...</span>
            : hasProposal ? '✓ Proposal Generated' : 'Generate Proposal'}
        </button>
      </MagneticButton>

      {hasProposal && !hasImpact && (
        <motion.div
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.2, duration: 0.4, ease }}
        >
          <button
            onClick={onImpact}
            disabled={impactLoading}
            className="btn-secondary w-full py-3 text-14"
          >
            {impactLoading ? <span className="flex items-center justify-center gap-2"><span className="spinner spinner-dark" /> Generating...</span>
              : 'Generate Impact Statement'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
