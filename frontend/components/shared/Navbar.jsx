'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import MagneticButton from '@/components/motion/MagneticButton';

/* ═══════════════════════════════════════════════════
   NAVBAR — Polished
   Scroll-aware blur intensity, hover underlines,
   logo micro-animation, magnetic CTA
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

const navLinks = [
  { href: '#workflow', label: 'How It Works' },
  { href: '#features', label: 'Features' },
  { href: '#demo', label: 'Demo' },
];

function NavLink({ href, label }) {
  return (
    <a
      href={href}
      className="relative text-14 text-text-secondary hover:text-text-primary transition-colors duration-300 py-1"
    >
      {label}
      <motion.span
        className="absolute left-0 right-0 bottom-0 h-[1px]"
        style={{ backgroundColor: 'currentColor', originX: 0.5 }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease }}
      />
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="fixed top-0 left-0 right-0 z-50 px-6"
      style={{
        backgroundColor: scrolled ? 'rgba(250, 250, 248, 0.9)' : 'rgba(250, 250, 248, 0.85)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
        borderBottom: scrolled ? '1px solid rgba(232, 226, 218, 0.5)' : '1px solid transparent',
        transition: 'background-color 0.4s, backdrop-filter 0.4s, border-color 0.4s',
        padding: scrolled ? '12px 24px' : '16px 24px',
      }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-lg bg-accent-black flex items-center justify-center"
            whileHover={{ rotate: -5, scale: 1.08 }}
            transition={{ duration: 0.3, ease }}
          >
            <span className="text-white text-14 font-semibold">G</span>
          </motion.div>
          <span className="text-18 font-semibold text-text-primary tracking-tight">
            GovBridge
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-14 text-text-secondary hover:text-text-primary transition-colors duration-300 px-4 py-2 relative"
          >
            Log In
            <motion.span
              className="absolute left-4 right-4 bottom-1 h-[1px]"
              style={{ backgroundColor: 'currentColor', originX: 0.5 }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease }}
            />
          </Link>
          <MagneticButton strength={0.2} radius={4}>
            <Link href="/signup" className="btn-primary text-14 py-2.5 px-6">
              Get Started
            </Link>
          </MagneticButton>
        </div>
      </div>
    </motion.nav>
  );
}
