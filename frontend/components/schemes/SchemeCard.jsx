'use client';

import { useState, useRef, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import EligibilityBar from './EligibilityBar';

/* ═══════════════════════════════════════════════════
   SCHEME CARD — Premium Interactive
   Hover lift + depth shadow + subtle tilt + animated
   readiness ring + expand animation for missing docs
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

function SchemeCard({ scheme, match }) {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const missing = match?.missing_documents || [];
  const readiness = match?.readiness_score || 0;

  // Compute document-based eligibility: (docs the user HAS / total required docs) * 100
  const requiredDocs = scheme.required_documents || scheme.required_docs || [];
  const totalRequired = requiredDocs.length;
  const docsOwned = totalRequired - missing.length;
  const docEligibility = totalRequired > 0 ? Math.round((docsOwned / totalRequired) * 100) : 0;

  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springConfig = { stiffness: 250, damping: 22 };
  const sRotateX = useSpring(rotateX, springConfig);
  const sRotateY = useSpring(rotateY, springConfig);

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
          borderColor: isHovered ? '#D4C5B0' : '#E8E2DA',
        }}
        transition={{ duration: 0.3, ease }}
        className="p-6 rounded-2xl flex flex-col"
        style2={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
      >
        <div
          className="p-6 rounded-2xl flex flex-col h-full"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid transparent' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-18 font-semibold text-text-primary mb-1">{scheme.name}</h3>
              <p className="text-12 text-text-secondary">{scheme.ministry}</p>
            </div>
            {/* Animated readiness ring */}
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#E8E2DA" strokeWidth="3" />
                <motion.circle
                  cx="24" cy="24" r="20" fill="none" stroke="#1A5C38" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={125.6}
                  initial={{ strokeDashoffset: 125.6 }}
                  whileInView={{ strokeDashoffset: 125.6 * (1 - readiness / 100) }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-12 font-mono font-semibold" style={{ color: '#1A5C38' }}>
                {Math.round(readiness)}
              </span>
            </div>
          </div>

          <EligibilityBar score={match ? docEligibility : (scheme.eligibility_score || 0)} />

          <div className="flex items-center gap-3 mt-4 mb-4">
            <span className="text-14 font-mono font-medium text-text-primary">
              ₹{(scheme.funding_min / 100000).toFixed(0)}L – ₹{(scheme.funding_max / 100000).toFixed(0)}L
            </span>
            <span className="text-12 px-2.5 py-1 rounded-full" style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}>
              {scheme.deadline}
            </span>
          </div>

          {missing.length > 0 && (
            <motion.button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-12 font-medium px-3 py-1.5 rounded-full mb-3 self-start transition-colors duration-200"
              style={{ backgroundColor: '#FFF8E1', color: '#92600A' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {missing.length} docs missing
              <motion.span
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease }}
                className="text-10"
              >
                ▼
              </motion.span>
            </motion.button>
          )}

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex flex-wrap gap-2 mb-3 overflow-hidden"
            >
              {missing.map((doc, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease }}
                  className="text-12 px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#FFEBEE', color: '#8B1A1A' }}
                >
                  {doc}
                </motion.span>
              ))}
            </motion.div>
          )}

          <Link
            href={`/schemes/${scheme.id}`}
            className="mt-auto btn-secondary text-14 py-2.5 text-center hover-lift"
          >
            View Details
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default memo(SchemeCard);
