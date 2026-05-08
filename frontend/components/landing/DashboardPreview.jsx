'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';
import BlurReveal from '@/components/motion/BlurReveal';
import CinematicReveal from '@/components/motion/CinematicReveal';
import SmoothCounter from '@/components/motion/SmoothCounter';

/* ═══════════════════════════════════════════════════
   DASHBOARD PREVIEW — Perspective Scroll
   Mock dashboard with perspective entry, animated
   counters, staggered slide-in, depth shadows
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export default function DashboardPreview() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 1], [0.03, 0.08]);

  return (
    <section ref={sectionRef} className="py-24 px-6" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-[1200px] mx-auto">
        <CinematicReveal>
          <div className="text-center mb-12">
            <motion.span
              className="inline-block text-12 font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              Dashboard
            </motion.span>
            <BlurReveal duration={0.8} blur={10} distance={30}>
              <h2 className="text-48 font-light text-text-primary tracking-tight">
                Your AI Command Center
              </h2>
            </BlurReveal>
          </div>
        </CinematicReveal>

        {/* Perspective container */}
        <div style={{ perspective: '1200px' }}>
          <motion.div
            style={{
              rotateX,
              scale,
              transformStyle: 'preserve-3d',
              transformOrigin: 'center bottom',
            }}
            className="rounded-2xl overflow-hidden"
          >
            <motion.div
              style={{
                boxShadow: `0 16px 50px rgba(0,0,0,${shadowOpacity.get()})`,
                border: '1px solid #E8E2DA',
              }}
              className="rounded-2xl"
            >
              {/* Mock dashboard */}
              <div className="p-8" style={{ backgroundColor: '#FFFFFF' }}>
                {/* Top bar */}
                <BlurReveal delay={0.1} distance={15}>
                  <div className="flex items-center justify-between mb-8 pb-6" style={{ borderBottom: '1px solid #E8E2DA' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent-black flex items-center justify-center">
                        <span className="text-white text-12 font-semibold">G</span>
                      </div>
                      <span className="text-16 font-semibold text-text-primary">Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: '#F5F2EE' }} />
                      <span className="text-14 text-text-secondary">Priya Sharma</span>
                    </div>
                  </div>
                </BlurReveal>

                {/* Stats row — animated counters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Matched Schemes', value: 5, suffix: '', color: '#0A0A0A' },
                    { label: 'Avg Eligibility', value: 78, suffix: '%', color: '#1A5C38' },
                    { label: 'Applications', value: 3, suffix: '', color: '#0A0A0A' },
                    { label: 'Jobs Created', value: 2, suffix: '', color: '#1A5C38' },
                  ].map((stat, i) => (
                    <BlurReveal key={i} delay={0.15 + i * 0.08} distance={20}>
                      <div
                        className="p-5 rounded-xl"
                        style={{ backgroundColor: '#FAFAF8', border: '1px solid #E8E2DA' }}
                      >
                        <p className="text-12 text-text-secondary mb-1">{stat.label}</p>
                        <p className="text-32 font-light font-mono" style={{ color: stat.color }}>
                          <SmoothCounter to={stat.value} suffix={stat.suffix} duration={1.2} delay={0.3 + i * 0.1} />
                        </p>
                      </div>
                    </BlurReveal>
                  ))}
                </div>

                {/* Scheme rows — staggered slide-in */}
                <div className="space-y-3">
                  {[
                    { name: 'PMEGP', score: 92, status: 'Under Review' },
                    { name: 'MUDRA Yojana', score: 87, status: 'Draft' },
                    { name: 'Stand-Up India', score: 74, status: 'Approved' },
                  ].map((row, i) => (
                    <BlurReveal key={i} delay={0.3 + i * 0.1} direction="left" distance={25}>
                      <div
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{ backgroundColor: '#FAFAF8', border: '1px solid #E8E2DA' }}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-14 font-medium text-text-primary">{row.name}</span>
                        </div>
                        <div className="flex items-center gap-6">
                          <span className="text-14 font-mono" style={{ color: '#1A5C38' }}>
                            {row.score}%
                          </span>
                          <span
                            className="text-12 px-3 py-1 rounded-full"
                            style={{
                              backgroundColor: row.status === 'Approved' ? '#E8F5E9' : '#F5F2EE',
                              color: row.status === 'Approved' ? '#1A5C38' : '#6B6560',
                            }}
                          >
                            {row.status}
                          </span>
                        </div>
                      </div>
                    </BlurReveal>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
