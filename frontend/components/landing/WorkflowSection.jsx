'use client';

import { useRef } from 'react';
import { Search, ShieldCheck, FileText, Send, CheckCircle, Briefcase, Users } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';

/* ═══════════════════════════════════════════════════
   WORKFLOW SECTION — Cinematic Process Flow
   Animated connecting lines, progressive activation,
   scroll-driven step reveals, floating cards
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

const steps = [
  { num: '01', icon: Users, title: 'Sign Up', desc: 'Create your profile with entity details' },
  { num: '02', icon: Search, title: 'AI Matching', desc: 'AI scores 15+ schemes for your profile' },
  { num: '03', icon: ShieldCheck, title: 'Compliance Check', desc: 'Verify documents against requirements' },
  { num: '04', icon: FileText, title: 'Generate Proposal', desc: 'AI writes a 4-section grant proposal' },
  { num: '05', icon: Send, title: 'Apply', desc: 'Submit application to matched schemes' },
  { num: '06', icon: CheckCircle, title: 'Get Funded', desc: 'Track application through approval' },
  { num: '07', icon: Briefcase, title: 'Create Jobs', desc: 'AI generates job listings from funding' },
];

/* ── Animated SVG line connecting two steps ── */
function AnimatedConnector({ index, total }) {
  return (
    <div className="flex items-center h-[120px] pt-[60px]">
      <svg width="32" height="2" viewBox="0 0 32 2" className="overflow-visible">
        <motion.line
          x1="0" y1="1" x2="32" y2="1"
          stroke="#111111"
          strokeWidth="1"
          strokeDasharray="4 3"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.25 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: index * 0.08 + 0.3, ease }}
        />
      </svg>
    </div>
  );
}

/* ── Timeline pulse dot ── */
function TimelinePulse({ delay = 0 }) {
  return (
    <div className="relative w-3 h-3 mx-auto mb-3">
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: '#D4C5B0' }}
        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 3, delay, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: '#D4C5B0' }}
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.4, delay: delay * 0.3, ease }}
      />
    </div>
  );
}

/* ── Step Card with depth and hover ── */
function StepCard({ step, index }) {
  const Icon = step.icon;

  return (
    <motion.div
      className="flex flex-col items-center w-[180px]"
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease }}
    >
      {/* Large step number — independent depth animation */}
      <motion.span
        className="text-[120px] font-extralight leading-none select-none"
        style={{ color: '#D4C5B0' }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: index * 0.06, ease }}
      >
        {step.num}
      </motion.span>

      {/* Pulse indicator */}
      <TimelinePulse delay={index * 0.5} />

      {/* Icon with hover scale */}
      <motion.div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: '#F5F2EE' }}
        whileHover={{
          scale: 1.12,
          backgroundColor: '#EDE8E0',
          transition: { duration: 0.3, ease },
        }}
        whileInView={{
          scale: [0.9, 1.08, 1],
        }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.08 + 0.2, ease }}
      >
        <Icon size={24} color="#0A0A0A" strokeWidth={1.5} />
      </motion.div>

      <h3 className="text-16 font-semibold text-text-primary mb-1">{step.title}</h3>
      <p className="text-14 text-text-secondary text-center leading-snug px-2">{step.desc}</p>
    </motion.div>
  );
}

/* ── Mobile Step Card ── */
function MobileStepCard({ step, index, isLast }) {
  const Icon = step.icon;

  return (
    <motion.div
      className="flex items-start gap-5"
      initial={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
    >
      <div className="flex flex-col items-center">
        <motion.span
          className="text-[64px] font-extralight leading-none select-none"
          style={{ color: '#D4C5B0' }}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: index * 0.05, ease }}
        >
          {step.num}
        </motion.span>
        {!isLast && (
          <motion.div
            className="w-px h-8 mt-2"
            style={{ backgroundColor: 'rgba(17,17,17,0.15)' }}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.06 + 0.3, ease }}
            style={{ transformOrigin: 'top', backgroundColor: 'rgba(17,17,17,0.15)' }}
          />
        )}
      </div>
      <div className="pt-4">
        <motion.div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
          style={{ backgroundColor: '#F5F2EE' }}
          whileInView={{ scale: [0.9, 1.08, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.06 + 0.1, ease }}
        >
          <Icon size={20} color="#0A0A0A" strokeWidth={1.5} />
        </motion.div>
        <h3 className="text-16 font-semibold text-text-primary mb-1">{step.title}</h3>
        <p className="text-14 text-text-secondary">{step.desc}</p>
      </div>
    </motion.div>
  );
}

export default function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 px-6" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-[1440px] mx-auto">
        {/* Section heading — cinematic reveal */}
        <CinematicReveal>
          <div className="text-center mb-16">
            <motion.span
              className="inline-block text-12 font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              Process
            </motion.span>
            <BlurReveal duration={0.8} blur={10} distance={30}>
              <h2 className="text-48 font-light text-text-primary tracking-tight">
                How It Works
              </h2>
            </BlurReveal>
          </div>
        </CinematicReveal>

        {/* Desktop: Horizontal with animated connectors */}
        <div className="hidden md:block overflow-x-auto pb-8 -mx-6 px-6">
          <div className="flex items-start gap-0 min-w-max">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start">
                <StepCard step={step} index={i} />
                {i < steps.length - 1 && (
                  <AnimatedConnector index={i} total={steps.length} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical with animated lines */}
        <div className="md:hidden flex flex-col gap-8">
          {steps.map((step, i) => (
            <MobileStepCard key={i} step={step} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
