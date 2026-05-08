'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import BlurReveal from '@/components/motion/BlurReveal';

/* ═══════════════════════════════════════════════════
   FOOTER — Polished
   BlurReveal entrance, hover underlines on links,
   logo micro-animation matching Navbar
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

const footerLinks = [
  { href: '#workflow', label: 'How It Works' },
  { href: '#features', label: 'Features' },
  { href: '/login', label: 'Login' },
  { href: '/signup', label: 'Sign Up' },
];

export default function Footer() {
  return (
    <BlurReveal blur={6} distance={20} once={true}>
      <footer className="py-16 px-6" style={{ backgroundColor: '#F5F2EE' }}>
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="w-7 h-7 rounded-md bg-accent-black flex items-center justify-center"
              whileHover={{ rotate: -5, scale: 1.08 }}
              transition={{ duration: 0.3, ease }}
            >
              <span className="text-white text-12 font-semibold">G</span>
            </motion.div>
            <span className="text-16 font-semibold text-text-primary tracking-tight">
              GovBridge GrantMate
            </span>
          </Link>

          <div className="flex items-center gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-14 text-text-secondary hover:text-text-primary transition-colors duration-300 link-underline"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-12 text-text-secondary">
            © 2026 GovBridge GrantMate. All rights reserved.
          </p>
        </div>
      </footer>
    </BlurReveal>
  );
}
