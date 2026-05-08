'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import FadeUp from '@/components/motion/FadeUp';
import BlurReveal from '@/components/motion/BlurReveal';
import CinematicReveal from '@/components/motion/CinematicReveal';
import SmoothCounter from '@/components/motion/SmoothCounter';
import MotionWrapper from '@/components/motion/MotionWrapper';
import { api } from '@/lib/api';
import { mockDashboard, mockUserMatches, mockApplications } from '@/lib/mockData';

const ease = [0.16, 1, 0.3, 1];

const entityCards = [
  { value: 'startup', label: 'Startup', desc: 'Early-stage company' },
  { value: 'msme', label: 'MSME', desc: 'Micro/Small/Medium enterprise' },
  { value: 'ngo', label: 'NGO', desc: 'Non-profit organization' },
];

function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ entity_type: '', name: '', industry: '', location: '', revenue: '', years: '', docs: [] });
  const [loading, setLoading] = useState(false);

  const docOptions = ['Aadhaar', 'PAN Card', 'GST Certificate', 'Bank Statement', 'Project Report', 'ITR', 'Udyam Certificate', 'Business Plan'];
  const toggleDoc = (d) => setForm((p) => ({ ...p, docs: p.docs.includes(d) ? p.docs.filter((x) => x !== d) : [...p.docs, d] }));

  const handleMatch = async () => {
    if (loading) return;
    setLoading(true);
    const { error } = await api.schemes.match({
      entity_type: form.entity_type,
      location: form.location,
      industry: form.industry,
      revenue: parseInt(form.revenue) || 0,
    });
    if (error) console.warn('Match fallback:', error);
    localStorage.setItem('onboarded', 'true');
    router.push('/schemes');
  };

  return (
    <div className="max-w-[640px] mx-auto">
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">Set up your profile</h1>
        <p className="text-16 text-text-secondary mb-8">Step {step} of 4</p>
      </CinematicReveal>

      {/* Animated progress bar */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3, 4].map((s) => (
          <motion.div
            key={s}
            className="flex-1 h-1.5 rounded-full"
            animate={{ backgroundColor: s <= step ? '#111111' : '#E8E2DA' }}
            transition={{ duration: 0.4, ease }}
          />
        ))}
      </div>

      {step === 1 && (
        <CinematicReveal>
          <p className="text-18 font-medium text-text-primary mb-6">What type of entity are you?</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {entityCards.map((e, i) => (
              <MotionWrapper key={e.value} tiltMax={3} liftAmount={-4}>
                <button
                  onClick={() => { setForm((p) => ({ ...p, entity_type: e.value })); setStep(2); }}
                  className="p-6 rounded-2xl text-left w-full transition-colors duration-300"
                  style={{
                    backgroundColor: form.entity_type === e.value ? '#111111' : '#FFFFFF',
                    color: form.entity_type === e.value ? '#FFFFFF' : '#0A0A0A',
                    border: '1px solid #E8E2DA',
                  }}
                >
                  <p className="text-18 font-semibold mb-1">{e.label}</p>
                  <p className="text-14 opacity-60">{e.desc}</p>
                </button>
              </MotionWrapper>
            ))}
          </div>
        </CinematicReveal>
      )}

      {step === 2 && (
        <BlurReveal blur={6} distance={20}>
          <div className="space-y-4">
            <div><label className="block text-14 text-text-secondary mb-2">Business Name</label><input className="input-field" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Kumar Foods" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-14 text-text-secondary mb-2">Industry</label><input className="input-field" value={form.industry} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))} placeholder="Food" /></div>
              <div><label className="block text-14 text-text-secondary mb-2">Location</label><input className="input-field" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Chennai" /></div>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(1)} className="btn-secondary py-3 px-6 text-14">Back</button>
            <button onClick={() => setStep(3)} className="btn-primary py-3 px-6 text-14">Next</button>
          </div>
        </BlurReveal>
      )}

      {step === 3 && (
        <BlurReveal blur={6} distance={20}>
          <div className="space-y-4">
            <div><label className="block text-14 text-text-secondary mb-2">Annual Revenue</label><select className="input-field" value={form.revenue} onChange={(e) => setForm((p) => ({ ...p, revenue: e.target.value }))} style={{ cursor: 'pointer' }}><option value="">Select range</option><option value="100000">Under ₹1 Lakh</option><option value="500000">₹1L – ₹5L</option><option value="1000000">₹5L – ₹10L</option><option value="2500000">₹10L – ₹25L</option><option value="5000000">₹25L+</option></select></div>
            <div><label className="block text-14 text-text-secondary mb-2">Years in Operation</label><select className="input-field" value={form.years} onChange={(e) => setForm((p) => ({ ...p, years: e.target.value }))} style={{ cursor: 'pointer' }}><option value="">Select</option><option value="0">Less than 1</option><option value="1">1-3 years</option><option value="3">3-5 years</option><option value="5">5+ years</option></select></div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setStep(2)} className="btn-secondary py-3 px-6 text-14">Back</button>
            <button onClick={() => setStep(4)} className="btn-primary py-3 px-6 text-14">Next</button>
          </div>
        </BlurReveal>
      )}

      {step === 4 && (
        <BlurReveal blur={6} distance={20}>
          <p className="text-18 font-medium text-text-primary mb-4">Which documents do you have?</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {docOptions.map((d) => (
              <motion.button
                key={d}
                onClick={() => toggleDoc(d)}
                className="text-14 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: form.docs.includes(d) ? '#111111' : '#F5F2EE',
                  color: form.docs.includes(d) ? '#FFFFFF' : '#6B6560',
                  border: form.docs.includes(d) ? '1px solid #111111' : '1px solid #E8E2DA',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                transition={{ duration: 0.2 }}
              >
                {form.docs.includes(d) ? '✓ ' : ''}{d}
              </motion.button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="btn-secondary py-3 px-6 text-14">Back</button>
            <motion.button
              onClick={handleMatch}
              disabled={loading}
              className="btn-primary py-4 px-8 text-16 flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Finding Schemes...</span> : 'Find My Schemes →'}
            </motion.button>
          </div>
        </BlurReveal>
      )}
    </div>
  );
}

function DashboardSummary() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    api.dashboard.summary().then(({ data: d }) => {
      if (d && d.top_matches && d.top_matches.length > 0) setData(d);
      else setData(mockDashboard);
    });
  }, [loaded]);

  const dash = data || mockDashboard;
  const matches = dash.top_matches || mockUserMatches;

  return (
    <div>
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">Dashboard</h1>
        <p className="text-16 text-text-secondary mb-8">Your AI-powered funding overview</p>
      </CinematicReveal>

      {/* Stats — animated counters with depth */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Top Match Score', value: matches[0]?.eligibility_score || 0, suffix: '%', color: '#1A5C38' },
          { label: 'Avg Eligibility', value: dash.avg_eligibility || 0, suffix: '%', color: '#0A0A0A', decimals: 1 },
          { label: 'Critical Doc Gaps', value: (dash.critical_gaps || []).length, suffix: '', color: '#8B1A1A' },
        ].map((s, i) => (
          <BlurReveal key={i} delay={i * 0.1} blur={6} distance={20}>
            <motion.div
              className="p-6 rounded-2xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
              transition={{ duration: 0.3, ease }}
            >
              <p className="text-12 text-text-secondary mb-2">{s.label}</p>
              <p className="text-32 font-light font-mono" style={{ color: s.color }}>
                <SmoothCounter to={s.value} suffix={s.suffix} duration={1.2} decimals={s.decimals || 0} blur delay={0.2 + i * 0.1} />
              </p>
            </motion.div>
          </BlurReveal>
        ))}
      </div>

      {/* Top Matched Schemes */}
      <BlurReveal delay={0.2} blur={4} distance={15}>
        <h2 className="text-18 font-medium text-text-primary mb-4">Top Matched Schemes</h2>
      </BlurReveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {matches.slice(0, 3).map((m, i) => (
          <BlurReveal key={i} delay={0.25 + i * 0.08} blur={6} distance={20}>
            <motion.div
              className="p-5 rounded-2xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
              whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-14 font-semibold text-text-primary">{m.scheme_name}</p>
                <span className="text-14 font-mono font-semibold" style={{ color: '#1A5C38' }}>{m.eligibility_score}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full mb-3" style={{ backgroundColor: '#F5F2EE' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#1A5C38' }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${m.readiness_score || 0}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.1, ease }}
                />
              </div>
              {(m.missing_documents || []).length > 0 && (
                <span className="text-12 px-2.5 py-1 rounded-full" style={{ backgroundColor: '#FFF8E1', color: '#92600A' }}>
                  {m.missing_documents.length} docs missing
                </span>
              )}
            </motion.div>
          </BlurReveal>
        ))}
      </div>

      {/* Recent Applications — staggered slide-in from right */}
      <BlurReveal delay={0.3} blur={4} distance={15}>
        <h2 className="text-18 font-medium text-text-primary mb-4">Recent Applications</h2>
      </BlurReveal>
      <div className="space-y-3">
        {mockApplications.slice(0, 3).map((a, i) => (
          <BlurReveal key={a.id} delay={0.35 + i * 0.08} direction="right" distance={25} blur={4}>
            <motion.div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
              whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}
              transition={{ duration: 0.25, ease }}
            >
              <p className="text-14 font-medium text-text-primary">{a.scheme_name}</p>
              <div className="flex items-center gap-3">
                <span className="text-12 font-mono" style={{ color: '#1A5C38' }}>{a.readiness_score}%</span>
                <span className="text-12 px-3 py-1 rounded-full" style={{
                  backgroundColor: a.status === 'approved' || a.status === 'funded' ? '#E8F5E9' : '#F5F2EE',
                  color: a.status === 'approved' || a.status === 'funded' ? '#1A5C38' : '#6B6560',
                }}>
                  {a.status.replace(/_/g, ' ')}
                </span>
              </div>
            </motion.div>
          </BlurReveal>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [onboarded, setOnboarded] = useState(false);
  useEffect(() => { setOnboarded(localStorage.getItem('onboarded') === 'true'); }, []);
  return onboarded ? <DashboardSummary /> : <Onboarding />;
}
