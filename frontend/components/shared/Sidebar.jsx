'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Search, ShieldCheck, FileText, ClipboardList, Briefcase, LogOut } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   SIDEBAR — Cinematic Dashboard Navigation
   Animated active indicator with layoutId,
   hover lighting, icon micro-animations,
   smooth fade-in on mount
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/schemes', label: 'Schemes', icon: Search },
  { href: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { href: '/proposal', label: 'Proposal', icon: FileText },
  { href: '/tracker', label: 'Tracker', icon: ClipboardList },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [entityType, setEntityType] = useState('');

  // Read user info from localStorage only after hydration
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u.name) setUserName(u.name.split(' ')[0]);
      if (u.entity_type) setEntityType(u.entity_type.toUpperCase());
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('onboarded');
    router.push('/login');
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease }}
      className="fixed left-0 top-0 bottom-0 w-[240px] flex-col py-8 px-4 z-40 hidden lg:flex"
      style={{ backgroundColor: '#FFFFFF', borderRight: '1px solid #E8E2DA' }}
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-4 mb-10">
        <motion.div
          className="w-8 h-8 rounded-lg bg-accent-black flex items-center justify-center"
          whileHover={{ rotate: -5, scale: 1.05 }}
          transition={{ duration: 0.3, ease }}
        >
          <span className="text-white text-14 font-semibold">G</span>
        </motion.div>
        <span className="text-16 font-semibold text-text-primary tracking-tight">GovBridge</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(link.href + '/');

          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-14 font-medium transition-colors duration-200"
              style={{ color: active ? '#FFFFFF' : '#6B6560' }}
            >
              {/* Animated active background pill */}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: '#111111' }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Hover glow background */}
              {!active && (
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{ backgroundColor: 'rgba(245,242,238,0.6)' }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Icon with micro-animation */}
              <motion.span
                className="relative z-10"
                whileHover={!active ? { scale: 1.12, rotate: -5 } : {}}
                transition={{ duration: 0.25, ease }}
              >
                <Icon size={18} strokeWidth={1.5} />
              </motion.span>

              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <motion.div
        className="px-4 pt-4 space-y-3"
        style={{ borderTop: '1px solid #E8E2DA' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3, ease }}
      >
        <Link href="/profile" className="flex items-center gap-3 cursor-pointer rounded-xl p-1 -m-1 transition-colors hover:bg-[#F5F2EE]">
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center text-12 font-semibold text-white"
            style={{ backgroundColor: '#D4C5B0' }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            {userName[0]}
          </motion.div>
          <div>
            <p className="text-14 font-medium text-text-primary">{userName}</p>
            <p className="text-12 text-text-secondary">{entityType}</p>
          </div>
        </Link>
        <motion.button
          onClick={handleLogout}
          className="flex items-center gap-2 text-14 text-text-secondary hover:text-text-primary transition-colors w-full px-0"
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          <LogOut size={16} strokeWidth={1.5} /> Log out
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}
