'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import MagneticButton from '@/components/motion/MagneticButton';

/* ═══════════════════════════════════════════════════
   SIGNUP — Cinematic Polish
   Split-screen depth, line-by-line text reveal,
   perspective form, staggered fields, magnetic submit
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

const entityTypes = [
  { value: 'startup', label: 'Startup' },
  { value: 'msme', label: 'MSME' },
  { value: 'ngo', label: 'NGO' },
  { value: 'jobseeker', label: 'Job Seeker' },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', entity_type: '', location: '', industry: '', revenue: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    const { data, error: err } = await api.auth.signup({ ...form, revenue: parseInt(form.revenue) || 0 });
    if (err) {
      setError(err);
      setLoading(false);
      return;
    }
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    router.push('/dashboard');
  };

  const fields = [
    { id: 'signup-name', label: 'Full Name', type: 'text', field: 'name', placeholder: 'Priya Sharma', required: true },
    { id: 'signup-email', label: 'Email', type: 'email', field: 'email', placeholder: 'you@example.com', required: true },
    { id: 'signup-password', label: 'Password', type: 'password', field: 'password', placeholder: '••••••••', required: true },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel — cinematic */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-center px-16 relative overflow-hidden grain-texture" style={{ backgroundColor: '#111111' }}>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: [
              'radial-gradient(ellipse 50% 50% at 40% 70%, rgba(212,197,176,0.04) 0%, transparent 70%)',
              'radial-gradient(ellipse 50% 50% at 70% 30%, rgba(212,197,176,0.06) 0%, transparent 70%)',
              'radial-gradient(ellipse 50% 50% at 40% 70%, rgba(212,197,176,0.04) 0%, transparent 70%)',
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

          {['Connect to', 'government funding.', 'Create local jobs.'].map((line, i) => (
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
            Sign up takes 30 seconds.<br />Our AI immediately matches you<br />to eligible schemes.
          </motion.p>
        </motion.div>
      </div>

      {/* Right panel — form with perspective */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto" style={{ backgroundColor: '#FAFAF8' }}>
        <div style={{ perspective: '1200px' }} className="w-full max-w-[440px]">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 4, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="lg:hidden flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded-lg bg-accent-black flex items-center justify-center"><span className="text-white text-14 font-semibold">G</span></div>
              <span className="text-18 font-semibold text-text-primary">GovBridge</span>
            </div>

            <h2 className="text-32 font-light text-text-primary tracking-tight mb-2">Create account</h2>
            <p className="text-16 text-text-secondary mb-8">Get matched with schemes in seconds</p>

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

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease }}
                >
                  <label className="block text-14 text-text-secondary mb-2">{f.label}</label>
                  <input id={f.id} type={f.type} required={f.required} value={form[f.field]} onChange={update(f.field)} className="input-field" placeholder={f.placeholder} />
                </motion.div>
              ))}

              {/* Entity Type with subtle highlight pulse */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease }}
              >
                <label className="block text-14 text-text-secondary mb-2">Entity Type</label>
                <motion.select
                  id="signup-entity-type"
                  required
                  value={form.entity_type}
                  onChange={update('entity_type')}
                  className="input-field"
                  style={{ appearance: 'none', cursor: 'pointer' }}
                  animate={!form.entity_type ? {
                    boxShadow: ['0 0 0 0px rgba(212,197,176,0)', '0 0 0 3px rgba(212,197,176,0.2)', '0 0 0 0px rgba(212,197,176,0)'],
                  } : {}}
                  transition={{ duration: 2, delay: 1.5, repeat: 2, ease: 'easeInOut' }}
                >
                  <option value="">Select entity type</option>
                  {entityTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </motion.select>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.4, ease }}
              >
                <div>
                  <label className="block text-14 text-text-secondary mb-2">Location</label>
                  <input id="signup-location" type="text" value={form.location} onChange={update('location')} className="input-field" placeholder="Chennai" />
                </div>
                <div>
                  <label className="block text-14 text-text-secondary mb-2">Industry</label>
                  <input id="signup-industry" type="text" value={form.industry} onChange={update('industry')} className="input-field" placeholder="Food" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42, duration: 0.4, ease }}
              >
                <label className="block text-14 text-text-secondary mb-2">Annual Revenue (₹)</label>
                <input id="signup-revenue" type="number" value={form.revenue} onChange={update('revenue')} className="input-field" placeholder="500000" min="0" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.4, ease }}
              >
                <MagneticButton strength={0.15} radius={4} className="w-full">
                  <button id="signup-submit" type="submit" disabled={loading} className="btn-primary w-full py-4 text-16 mt-2">
                    {loading ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Creating account...</span> : 'Create Account'}
                  </button>
                </MagneticButton>
              </motion.div>
            </form>

            <motion.p
              className="text-14 text-text-secondary text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4, ease }}
            >
              Already have an account? <Link href="/login" className="text-text-primary font-medium link-underline">Log in</Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
