'use client';

import { motion } from 'framer-motion';
import BlurReveal from '@/components/motion/BlurReveal';

/* ═══════════════════════════════════════════════════
   PROPOSAL PREVIEW — Paper-style Cinematic
   Layered shadows, elegant section reveal,
   paper-style rendering with depth
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export default function ProposalPreview({ proposal }) {
  if (!proposal) return (
    <motion.div
      className="flex items-center justify-center h-full p-12 rounded-2xl"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease }}
    >
      <p className="text-16 text-text-secondary text-center">Click &quot;Generate Proposal&quot; to see your AI-drafted proposal here.</p>
    </motion.div>
  );

  return (
    <BlurReveal blur={8} distance={25} duration={0.7}>
      <div
        className="p-8 rounded-2xl relative"
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E8E2DA',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)',
        }}
      >
        {/* Paper-style top edge highlight */}
        <div
          className="absolute top-0 left-4 right-4 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,197,176,0.4), transparent)' }}
        />

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-18 font-semibold text-text-primary">Proposal Preview</h3>
          <motion.button
            onClick={() => window.print()}
            className="btn-ghost text-12"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Export PDF
          </motion.button>
        </div>
        <div className="prose max-w-none">
          {proposal.sections ? Object.entries(proposal.sections).map(([key, val], i) => (
            <motion.div
              key={key}
              className="mb-6"
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: i * 0.12 + 0.2, duration: 0.5, ease }}
            >
              <h4 className="text-14 font-medium text-text-primary mb-2 capitalize">
                {key.replace(/_/g, ' ')}
              </h4>
              <p className="text-14 text-text-secondary leading-relaxed">{val}</p>
            </motion.div>
          )) : (
            <p className="text-14 text-text-secondary leading-relaxed whitespace-pre-wrap">{proposal.proposal_text}</p>
          )}
        </div>
      </div>
    </BlurReveal>
  );
}
