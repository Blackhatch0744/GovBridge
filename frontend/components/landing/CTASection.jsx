'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';
import MagneticButton from '@/components/motion/MagneticButton';

/* ═══════════════════════════════════════════════════
   CTA SECTION — Emotional Cinematic Ending
   Calm, powerful, optimistic. Layered motion lighting,
   floating particles, magnetic CTA, grain texture.
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

/* ── Minimal floating particles ── */
function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: `${10 + Math.random() * 80}%`,
      y: `${10 + Math.random() * 80}%`,
      size: 2 + Math.random() * 3,
      duration: 4 + Math.random() * 4,
      delay: Math.random() * 3,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full css-drift"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: 'rgba(255,255,255,0.15)',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Animated light sweep ── */
function LightSweep() {
  return (
    <>
      {/* Top radial light */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse 60% 40% at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 40% at 70% 30%, rgba(255,255,255,0.05) 0%, transparent 70%)',
            'radial-gradient(ellipse 60% 40% at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 70%)',
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Bottom subtle glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(212,197,176,0.06) 0%, transparent 70%)',
        }}
      />
    </>
  );
}

/* ── Section divider — line drawing from center ── */
function SectionDividerLine() {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center">
      <motion.div
        className="h-[1px]"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        initial={{ width: 0 }}
        whileInView={{ width: '40%' }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 1.2, ease }}
      />
    </div>
  );
}

export default function CTASection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden grain-texture" style={{ backgroundColor: '#111111' }}>
      {/* Animated light effects */}
      <LightSweep />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Top divider line */}
      <SectionDividerLine />

      <div className="max-w-[800px] mx-auto text-center relative z-10">
        {/* Headline — cinematic text reveal */}
        <CinematicReveal preset="dramatic" duration={1}>
          <h2 className="text-[48px] md:text-[64px] font-light text-white tracking-tight leading-tight mb-8">
            <BlurReveal blur={12} distance={40} duration={0.9} delay={0}>
              <span className="block">Build Local Economies</span>
            </BlurReveal>
            <BlurReveal blur={12} distance={40} duration={0.9} delay={0.15}>
              <span className="block">With AI</span>
            </BlurReveal>
          </h2>
        </CinematicReveal>

        {/* CTA Button — magnetic with subtle glow */}
        <CinematicReveal delay={0.3} preset="gentle">
          <div className="relative inline-block">
            {/* Subtle radial glow behind button */}
            <motion.div
              className="absolute inset-[-20px] rounded-full pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 40px rgba(255,255,255,0.04)',
                  '0 0 60px rgba(255,255,255,0.08)',
                  '0 0 40px rgba(255,255,255,0.04)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <MagneticButton strength={0.3} radius={6}>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-10 py-4 text-16 font-medium text-white rounded-full transition-all duration-300"
                style={{ border: '1px solid rgba(255,255,255,0.3)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Start for Free
              </Link>
            </MagneticButton>
          </div>
        </CinematicReveal>
      </div>
    </section>
  );
}
