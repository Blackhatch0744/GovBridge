'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import BlurReveal from '@/components/motion/BlurReveal';
import MagneticButton from '@/components/motion/MagneticButton';

/* ═══════════════════════════════════════════════════
   LOGIN — Cinematic Polish
   Split-screen depth, parallax text, perspective
   form entry, focus glow, magnetic submit, blur errors
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    const { data, error: err } = await api.auth.login({ email, password });
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — cinematic dark side */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-center px-16 relative overflow-hidden grain-texture" style={{ backgroundColor: '#111111' }}>
        {/* Ambient light */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(ellipse 50% 50% at 30% 60%, rgba(212,197,176,0.04) 0%, transparent 70%)',
              'radial-gradient(ellipse 50% 50% at 60% 40%, rgba(212,197,176,0.06) 0%, transparent 70%)',
              'radial-gradient(ellipse 50% 50% at 30% 60%, rgba(212,197,176,0.04) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, ease }}
          className="relative z-10"
        >
          <motion.div
            className="flex items-center gap-3 mb-12"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <span className="text-accent-black text-18 font-bold">G</span>
            </div>
            <span className="text-white text-24 font-semibold tracking-tight">GovBridge</span>
          </motion.div>

          {/* Line-by-line reveal */}
          {['Welcome back to', 'your AI command', 'center.'].map((line, i) => (
            <motion.span
              key={i}
              className="block text-[48px] font-light text-white leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease }}
            >
              {line}
            </motion.span>
          ))}

          <motion.p
            className="text-18 leading-relaxed mt-6"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease }}
          >
            Continue managing your schemes,<br />proposals, and applications.
          </motion.p>
        </motion.div>
      </div>

      {/* Right panel — form with perspective entry */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ backgroundColor: '#FAFAF8' }}>
        <div style={{ perspective: '1200px' }} className="w-full max-w-[400px]">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 4, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="lg:hidden flex items-center gap-2 mb-12">
              <div className="w-8 h-8 rounded-lg bg-accent-black flex items-center justify-center"><span className="text-white text-14 font-semibold">G</span></div>
              <span className="text-18 font-semibold text-text-primary">GovBridge</span>
            </div>

            <h2 className="text-32 font-light text-text-primary tracking-tight mb-2">Log in</h2>
            <p className="text-16 text-text-secondary mb-8">Enter your credentials to continue</p>

            {/* Error — blur-in */}
            {error && (
              <motion.div
                className="mb-6 px-4 py-3 rounded-xl text-14"
                style={{ backgroundColor: '#FFEBEE', color: '#8B1A1A' }}
                initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.3, ease }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4, ease }}
              >
                <label className="block text-14 text-text-secondary mb-2">Email</label>
                <input id="login-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.4, ease }}
              >
                <label className="block text-14 text-text-secondary mb-2">Password</label>
                <input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease }}
              >
                <MagneticButton strength={0.15} radius={4} className="w-full">
                  <button id="login-submit" type="submit" disabled={loading} className="btn-primary w-full py-4 text-16 mt-2">
                    {loading ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Logging in...</span> : 'Log In'}
                  </button>
                </MagneticButton>
              </motion.div>
            </form>

            <motion.p
              className="text-14 text-text-secondary text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease }}
            >
              Don&apos;t have an account? <Link href="/signup" className="text-text-primary font-medium link-underline">Sign up</Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
