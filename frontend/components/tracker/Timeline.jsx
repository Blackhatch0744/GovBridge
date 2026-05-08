'use client';

import { motion } from 'framer-motion';
import StatusChip from './StatusChip';

/* ═══════════════════════════════════════════════════
   TIMELINE — Cinematic Tracking
   Animated connectors, sequential pulse, flowing lines,
   staggered label reveal
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];
const statusFlow = ['draft', 'submitted', 'under_review', 'approved', 'funded'];

export default function Timeline({ application }) {
  if (!application) return null;
  const currentIdx = statusFlow.indexOf(application.status);

  return (
    <motion.div
      className="p-6 rounded-2xl"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, ease }}
    >
      <p className="text-14 font-medium text-text-primary mb-6">Timeline — {application.scheme_name}</p>
      <div className="flex items-center gap-0">
        {statusFlow.map((s, i) => {
          const reached = i <= currentIdx;
          const isCurrent = i === currentIdx;

          return (
            <div key={s} className="flex items-center flex-1">
              <motion.div className="flex flex-col items-center">
                {/* Dot with pulse ring for current */}
                <div className="relative">
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-[-4px] rounded-full"
                      style={{ border: `2px solid ${reached ? '#1A5C38' : '#E8E2DA'}` }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  <motion.div
                    className="w-4 h-4 rounded-full mb-2"
                    style={{ backgroundColor: reached ? '#1A5C38' : '#E8E2DA' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.4, ease }}
                  />
                </div>
                {/* Label with blur-in */}
                <motion.span
                  className="text-12 text-text-secondary text-center whitespace-nowrap"
                  initial={{ opacity: 0, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: i * 0.12 + 0.2, duration: 0.4, ease }}
                >
                  {s.replace(/_/g, ' ')}
                </motion.span>
              </motion.div>

              {/* Animated connector line */}
              {i < statusFlow.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 overflow-hidden rounded-full" style={{ backgroundColor: '#E8E2DA' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: i < currentIdx ? '#1A5C38' : 'transparent', transformOrigin: 'left', width: '100%', willChange: 'transform' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: i < currentIdx ? 1 : 0 }}
                    transition={{ delay: i * 0.15 + 0.3, duration: 0.5, ease }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Funded celebration */}
      {application.status === 'funded' && (
        <motion.div
          className="mt-4 pt-4 text-center"
          style={{ borderTop: '1px solid #E8E2DA' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5, ease }}
        >
          <motion.span
            className="inline-block text-14 font-medium px-4 py-2 rounded-full"
            style={{ backgroundColor: '#E8F5E9', color: '#1A5C38' }}
            animate={{
              boxShadow: [
                '0 0 0px rgba(26,92,56,0)',
                '0 0 20px rgba(26,92,56,0.15)',
                '0 0 0px rgba(26,92,56,0)',
              ],
            }}
            transition={{ duration: 2, repeat: 2, ease: 'easeInOut' }}
          >
            ★ Funding Approved
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
}
