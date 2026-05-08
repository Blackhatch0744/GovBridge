'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';
import SmoothCounter from '@/components/motion/SmoothCounter';

/* ═══════════════════════════════════════════════════
   STORY SECTION — Apple-Style Scroll Panels
   Sticky scroll with cinematic panel transitions,
   perspective transforms, glow effects, depth stagger
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

function TypeWriter({ text, isActive }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!isActive) {
      setDisplayed('');
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [isActive, text]);

  return (
    <span>
      {displayed}
      {isActive && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          style={{ color: '#D4C5B0' }}
        >
          │
        </motion.span>
      )}
    </span>
  );
}

const jobCards = [
  { title: 'Food Processing Operator', pay: '₹18,000 – ₹25,000', location: 'Chennai' },
  { title: 'Quality Assurance Lead', pay: '₹22,000 – ₹32,000', location: 'Chennai' },
  { title: 'Supply Chain Coordinator', pay: '₹20,000 – ₹28,000', location: 'Chennai' },
];

const proposalText =
  'This proposal outlines the strategic utilization of PMEGP funding to establish a food processing unit in Chennai, creating 12 direct employment opportunities and contributing to local economic development through supply chain integration with regional agricultural producers.';

export default function StorySection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const panel1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.3], [0, 1, 1]);
  const panel1Scale = useTransform(scrollYProgress, [0, 0.15, 0.3], [0.95, 1, 1]);
  const panel1RotateX = useTransform(scrollYProgress, [0, 0.15], [3, 0]);

  const panel2Opacity = useTransform(scrollYProgress, [0.3, 0.45, 0.65], [0, 1, 1]);
  const panel2Scale = useTransform(scrollYProgress, [0.3, 0.45, 0.65], [0.95, 1, 1]);
  const panel2RotateX = useTransform(scrollYProgress, [0.3, 0.45], [3, 0]);

  const panel3Opacity = useTransform(scrollYProgress, [0.65, 0.8, 1], [0, 1, 1]);
  const panel3Scale = useTransform(scrollYProgress, [0.65, 0.8, 1], [0.95, 1, 1]);
  const panel3RotateX = useTransform(scrollYProgress, [0.65, 0.8], [3, 0]);

  const [p1Active, setP1Active] = useState(false);
  const [p2Active, setP2Active] = useState(false);
  const [p3Active, setP3Active] = useState(false);

  useEffect(() => {
    const unsub1 = panel1Opacity.on('change', (v) => setP1Active(v > 0.5));
    const unsub2 = panel2Opacity.on('change', (v) => setP2Active(v > 0.5));
    const unsub3 = panel3Opacity.on('change', (v) => setP3Active(v > 0.5));
    return () => { unsub1(); unsub2(); unsub3(); };
  }, [panel1Opacity, panel2Opacity, panel3Opacity]);

  return (
    <section id="demo" ref={containerRef} className="relative" style={{ height: '300vh', backgroundColor: '#F5F2EE' }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Section heading */}
        <CinematicReveal>
          <div className="text-center mb-12">
            <motion.span
              className="inline-block text-12 font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: '#FFFFFF', color: '#6B6560' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              Live Demo
            </motion.span>
            <BlurReveal duration={0.8} blur={10} distance={30}>
              <h2 className="text-48 font-light text-text-primary tracking-tight">
                Watch the AI Work
              </h2>
            </BlurReveal>
          </div>
        </CinematicReveal>

        <div className="relative w-full max-w-[800px] min-h-[320px]" style={{ perspective: '1200px' }}>
          {/* ═══ PANEL 1: Compliance Score ═══ */}
          <motion.div
            style={{
              opacity: panel1Opacity,
              scale: panel1Scale,
              rotateX: panel1RotateX,
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0"
          >
            <div
              className="flex flex-col items-center justify-center p-10 rounded-2xl w-full relative"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
            >
              <p className="text-14 text-text-secondary mb-4 font-medium uppercase tracking-wider">Compliance Score</p>
              <div className="relative w-40 h-40 mb-4">
                {/* Subtle glow behind ring */}
                <motion.div
                  className="absolute inset-[-8px] rounded-full"
                  animate={p1Active ? {
                    boxShadow: [
                      '0 0 20px rgba(26,92,56,0.05)',
                      '0 0 40px rgba(26,92,56,0.12)',
                      '0 0 20px rgba(26,92,56,0.05)',
                    ],
                  } : {}}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#E8E2DA" strokeWidth="8" />
                  <motion.circle
                    cx="80" cy="80" r="70" fill="none"
                    stroke="#1A5C38"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={440}
                    initial={{ strokeDashoffset: 440 }}
                    animate={p1Active ? { strokeDashoffset: 440 * (1 - 0.94) } : { strokeDashoffset: 440 }}
                    transition={{ duration: 1.8, ease }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-48 font-light font-mono text-text-primary">
                    {p1Active ? <SmoothCounter to={94} suffix="%" duration={1.8} blur /> : '0%'}
                  </span>
                </div>
              </div>
              <p className="text-16 text-text-secondary">Documents verified against scheme requirements</p>
            </div>
          </motion.div>

          {/* ═══ PANEL 2: Proposal Generation ═══ */}
          <motion.div
            style={{
              opacity: panel2Opacity,
              scale: panel2Scale,
              rotateX: panel2RotateX,
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0"
          >
            <div
              className="flex flex-col p-10 rounded-2xl w-full h-full"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
            >
              <p className="text-14 text-text-secondary mb-4 font-medium uppercase tracking-wider">AI Proposal Generator</p>
              <div className="flex-1 p-6 rounded-xl" style={{ backgroundColor: '#FAFAF8' }}>
                <p className="text-16 text-text-primary leading-relaxed font-mono">
                  <TypeWriter text={proposalText} isActive={p2Active} />
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                {['Executive Summary', 'Funding Plan', 'Growth Plan', 'Impact'].map((s, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                    animate={p2Active ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
                    transition={{ delay: i * 0.15 + 0.5, duration: 0.4, ease }}
                    className="text-12 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ═══ PANEL 3: Job Cards ═══ */}
          <motion.div
            style={{
              opacity: panel3Opacity,
              scale: panel3Scale,
              rotateX: panel3RotateX,
              transformStyle: 'preserve-3d',
            }}
            className="absolute inset-0"
          >
            <div
              className="flex flex-col p-10 rounded-2xl w-full h-full"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
            >
              <p className="text-14 text-text-secondary mb-6 font-medium uppercase tracking-wider">Jobs Created from Funding</p>
              <div className="space-y-4 flex-1">
                {jobCards.map((job, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: 'blur(6px)', scale: 0.97 }}
                    animate={p3Active
                      ? { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }
                      : { opacity: 0, y: 30, filter: 'blur(6px)', scale: 0.97 }
                    }
                    transition={{
                      delay: i * 0.2 + 0.3,
                      duration: 0.6,
                      ease,
                    }}
                    className="flex items-center justify-between p-5 rounded-xl"
                    style={{
                      backgroundColor: '#FAFAF8',
                      border: '1px solid #E8E2DA',
                      boxShadow: `0 ${2 + i * 2}px ${6 + i * 4}px rgba(0,0,0,${0.02 + i * 0.01})`,
                    }}
                  >
                    <div>
                      <p className="text-16 font-medium text-text-primary">{job.title}</p>
                      <p className="text-14 text-text-secondary">{job.location}</p>
                    </div>
                    <span className="text-14 font-mono font-medium" style={{ color: '#1A5C38' }}>
                      {job.pay}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
