'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import SmoothCounter from '@/components/motion/SmoothCounter';
import MagneticButton from '@/components/motion/MagneticButton';
import FloatingElement from '@/components/motion/FloatingElement';
import ParallaxLayer from '@/components/motion/ParallaxLayer';

/* ═══════════════════════════════════════════════════
   HERO — Cinematic Experience
   Line-by-line text reveal, floating workflow cards
   with SVG connections, parallax depth, cursor-reactive
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

const headlineLines = [
  'From Government',
  'Funding to',
  'Local Employment.',
];

const workflowCards = [
  { label: 'Sign Up', icon: '01' },
  { label: 'AI Matches', icon: '02' },
  { label: 'Compliance', icon: '03' },
  { label: 'Proposal', icon: '04' },
  { label: 'Apply', icon: '05' },
  { label: 'Get Funded', icon: '06' },
  { label: 'Create Jobs', icon: '07' },
];

const stats = [
  { value: 15, suffix: '+', label: 'Schemes' },
  { value: 5, suffix: '', label: 'AI Agents' },
  { value: 100, suffix: '%', label: 'End-to-End' },
];

/* ── Animated SVG connection path between cards ── */
function ConnectionLines({ count }) {
  return (
    <svg
      className="absolute left-[16px] top-0 bottom-0 w-[2px]"
      style={{ height: '100%', overflow: 'visible', zIndex: 0 }}
    >
      {Array.from({ length: count - 1 }).map((_, i) => (
        <motion.line
          key={i}
          x1="1" y1={`${(i * 100) / (count - 1) + 6}%`}
          x2="1" y2={`${((i + 1) * 100) / (count - 1) + 2}%`}
          stroke="#D4C5B0"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 0.8, delay: 0.8 + i * 0.15, ease }}
        />
      ))}
    </svg>
  );
}

/* ── Glowing pulse node ── */
function PulseNode({ delay = 0 }) {
  return (
    <div className="relative w-2 h-2">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: '#D4C5B0' }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2.5,
          delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: '#D4C5B0' }}
      />
    </div>
  );
}

/* ── Animated dot grid background ── */
function AnimatedDotGrid() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease }}
      style={{
        backgroundImage: 'radial-gradient(circle, #E8E2DA 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
    />
  );
}

/* ── Ambient blurred shapes for depth ── */
function AmbientShapes() {
  return (
    <>
      <FloatingElement
        amplitude={12}
        duration={6}
        delay={0}
        mouseInfluence={0.3}
        className="absolute -top-20 -left-20 pointer-events-none"
      >
        <div
          className="w-[300px] h-[300px] rounded-full opacity-20"
          style={{ backgroundColor: '#D4C5B0', filter: 'blur(80px)' }}
        />
      </FloatingElement>
      <FloatingElement
        amplitude={10}
        duration={7}
        delay={1}
        mouseInfluence={0.2}
        className="absolute -bottom-32 right-[10%] pointer-events-none"
      >
        <div
          className="w-[250px] h-[250px] rounded-full opacity-15"
          style={{ backgroundColor: '#E8E2DA', filter: 'blur(60px)' }}
        />
      </FloatingElement>
    </>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0px', '80px']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0px', '30px']);

  /* Cursor-reactive parallax for right side */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen flex items-center px-6 pt-24 pb-16 relative overflow-hidden"
      style={{ backgroundColor: '#FAFAF8' }}
    >
      {/* ── Parallax Dot Grid ── */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <AnimatedDotGrid />
      </motion.div>

      {/* ── Ambient Depth Shapes ── */}
      <AmbientShapes />

      {/* ── Soft top-light illusion ── */}
      <div
        className="absolute top-0 left-0 right-0 h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,197,176,0.12) 0%, transparent 70%)',
        }}
      />

      <motion.div
        className="max-w-[1440px] mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-0 relative z-10"
        style={{ y: contentY }}
      >
        {/* ═══ LEFT — 60% ═══ */}
        <div className="w-full lg:w-[60%] flex flex-col gap-8">
          {/* Eyebrow tag — slide in from left with blur */}
          <motion.div
            initial={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease }}
          >
            <span
              className="inline-block text-12 font-medium tracking-widest uppercase px-4 py-2 rounded-full"
              style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
            >
              AI-Powered GovTech Platform
            </span>
          </motion.div>

          {/* Headline — line-by-line blur-to-sharp reveal */}
          <h1 className="text-[48px] md:text-[64px] lg:text-[80px] font-light leading-[1.05] tracking-tight text-text-primary">
            {headlineLines.map((line, i) => (
              <motion.span
                key={i}
                className="block overflow-hidden"
                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 + i * 0.12,
                  ease,
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          {/* Subtext — staggered word reveal */}
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            className="text-18 text-text-secondary max-w-[480px] leading-relaxed"
          >
            Discover schemes. Verify compliance.
            <br />
            Generate proposals. Create jobs.
            <br />
            All powered by AI.
          </motion.p>

          {/* CTA Buttons — magnetic hover */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.7, ease }}
            className="flex items-center gap-4 flex-wrap"
          >
            <MagneticButton strength={0.25} radius={5}>
              <Link href="/signup" className="btn-primary text-16 py-4 px-8">
                Get Started
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.2} radius={4}>
              <a href="#workflow" className="btn-secondary text-16 py-4 px-8">
                See How It Works
              </a>
            </MagneticButton>
          </motion.div>

          {/* Stats — animated counters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease }}
            className="flex items-center gap-6 mt-4"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center px-5 py-3 rounded-xl"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
                whileHover={{
                  y: -2,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  transition: { duration: 0.3, ease },
                }}
              >
                <span className="text-24 font-semibold text-text-primary font-mono">
                  <SmoothCounter to={stat.value} suffix={stat.suffix} duration={1.5} delay={0.9 + i * 0.15} />
                </span>
                <span className="text-12 text-text-secondary mt-0.5">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ═══ RIGHT — 40% Floating Workflow Cards ═══ */}
        <div className="w-full lg:w-[40%] relative flex items-center justify-center min-h-[400px] lg:min-h-[560px]">
          {/* Beige blob — parallax + floating */}
          <ParallaxLayer speed={-0.08} className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <FloatingElement amplitude={10} duration={5} mouseInfluence={0.4}>
              <div
                className="w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] rounded-full opacity-35"
                style={{ backgroundColor: '#D4C5B0', filter: 'blur(60px)' }}
              />
            </FloatingElement>
          </ParallaxLayer>

          {/* Workflow cards — cursor-reactive, floating, connected */}
          <motion.div
            className="relative w-full max-w-[360px] space-y-3"
            style={{ x: springX, y: springY }}
          >
            {/* SVG Connection lines */}
            <ConnectionLines count={workflowCards.length} />

            {workflowCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 40, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.6,
                  delay: 0.4 + i * 0.12,
                  ease,
                }}
                whileHover={{
                  y: -3,
                  x: 4,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                  transition: { duration: 0.3, ease },
                }}
                className="flex items-center gap-4 px-5 py-3.5 rounded-xl relative z-10"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E2DA',
                  boxShadow: `0 ${2 + i * 1}px ${8 + i * 3}px rgba(0,0,0,${0.03 + i * 0.005})`,
                }}
              >
                <span
                  className="text-12 font-mono font-semibold w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
                >
                  {card.icon}
                </span>
                <span className="text-14 font-medium text-text-primary">{card.label}</span>
                <div className="ml-auto">
                  <PulseNode delay={i * 0.4} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
