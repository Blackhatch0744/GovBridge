'use client';

import { useState, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { api } from '@/lib/api';

/* ═══════════════════════════════════════════════════
   JOB CARD — Premium Floating
   Hover depth + tilt, animated hiring pulse,
   skill chip stagger, SVG checkmark on apply
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

function JobCard({ job }) {
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springConfig = { stiffness: 250, damping: 22 };
  const sRotateX = useSpring(rotateX, springConfig);
  const sRotateY = useSpring(rotateY, springConfig);

  const handleApply = async () => {
    if (loading || applied) return;
    setLoading(true);
    const { data, error } = await api.jobs.apply(job.id, { resume_url: '' });
    if (data || error) setApplied(true);
    setLoading(false);
  };

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    rotateX.set(-y * 3);
    rotateY.set(x * 3);
  };

  const handleLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div style={{ perspective: '1200px' }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleLeave}
        style={{
          rotateX: sRotateX,
          rotateY: sRotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: isHovered ? -4 : 0,
          boxShadow: isHovered
            ? '0 16px 50px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)'
            : '0 1px 3px rgba(0,0,0,0.04)',
        }}
        transition={{ duration: 0.3, ease }}
        className="p-6 rounded-2xl"
        style2={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
      >
        <div style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-16 font-semibold text-text-primary">{job.title}</h3>
              <p className="text-14 text-text-secondary">{job.business} · {job.location}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Hiring pulse indicator — CSS animation */}
              <div
                className="w-2 h-2 rounded-full css-pulse-dot"
                style={{ backgroundColor: '#1A5C38' }}
              />
              <span className="text-12 px-3 py-1 rounded-full" style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}>
                {job.funded_by}
              </span>
            </div>
          </div>

          <p className="text-18 font-mono font-medium mb-4" style={{ color: '#1A5C38' }}>
            ₹{(job.pay_min / 1000).toFixed(0)}k – ₹{(job.pay_max / 1000).toFixed(0)}k /mo
          </p>

          {/* Skill chips with stagger */}
          <div className="flex flex-wrap gap-2 mb-5">
            {(job.skills || []).map((s, i) => (
              <motion.span
                key={i}
                className="text-12 px-3 py-1 rounded-full"
                style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3, ease }}
              >
                {s}
              </motion.span>
            ))}
          </div>

          {/* Apply button with checkmark animation */}
          <motion.button
            onClick={handleApply}
            disabled={loading || applied}
            className={applied ? 'w-full py-3 text-14 rounded-full font-medium' : 'btn-primary w-full py-3 text-14'}
            style={applied ? { backgroundColor: '#E8F5E9', color: '#1A5C38', border: '1px solid #1A5C38' } : {}}
            whileHover={!applied ? { scale: 1.02 } : {}}
            whileTap={!applied ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="spinner" /> Applying...
              </span>
            ) : applied ? (
              <motion.span
                className="flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* SVG Checkmark draw */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <motion.path
                    d="M3 8.5L6.5 12L13 4"
                    stroke="#1A5C38"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, ease }}
                  />
                </svg>
                Applied
              </motion.span>
            ) : (
              'Apply Now'
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(JobCard);
