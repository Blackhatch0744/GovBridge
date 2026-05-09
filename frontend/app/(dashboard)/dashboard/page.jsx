'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BlurReveal from '@/components/motion/BlurReveal';
import CinematicReveal from '@/components/motion/CinematicReveal';
import SmoothCounter from '@/components/motion/SmoothCounter';
import { api } from '@/lib/api';
import { mockSchemes, mockApplications } from '@/lib/mockData';

const ease = [0.16, 1, 0.3, 1];

const docOptions = [
  'Aadhaar', 'PAN Card', 'GST Certificate', 'Bank Statement',
  'Project Report', 'ITR', 'Udyam Registration', 'Business Plan',
  'DPIIT Certificate', 'Incorporation Certificate', 'Pitch Deck',
  'Address Proof', 'Caste Certificate', 'Financial Statements',
];

/* ═══════════════════════════════════════════════════
   DOCUMENT PICKER — Shown every time user visits
   User selects which docs they have, then we
   save + recalculate eligibility
   ═══════════════════════════════════════════════════ */

function DocumentPicker({ onComplete }) {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Load user's previously selected docs
  useEffect(() => {
    api.compliance.documents().then(({ data }) => {
      if (data && data.length > 0) {
        const existingTypes = data.map((d) => d.document_type);
        setSelectedDocs(existingTypes.filter((t) => docOptions.includes(t)));
      }
      setLoadingExisting(false);
    }).catch(() => setLoadingExisting(false));
  }, []);

  const toggleDoc = (d) => {
    setSelectedDocs((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const handleSubmit = async () => {
    if (saving) return;
    setSaving(true);

    // Save doc types to backend (clears old docs + compliance)
    await api.compliance.setTypes(selectedDocs);

    // Store in localStorage for other pages
    localStorage.setItem('userDocs', JSON.stringify(selectedDocs));

    setSaving(false);
    onComplete(selectedDocs);
  };

  if (loadingExisting) {
    return (
      <div className="max-w-[640px] mx-auto">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-12 rounded-xl skeleton"
              animate={{ scale: [0.99, 1.01, 0.99] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto">
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">
          Update Your Documents
        </h1>
        <p className="text-16 text-text-secondary mb-8">
          Select the documents you currently have — this calculates your scheme eligibility
        </p>
      </CinematicReveal>

      <BlurReveal blur={6} distance={20}>
        <div className="p-6 rounded-2xl mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
          <p className="text-14 font-semibold text-text-primary mb-4">Which documents do you have?</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {docOptions.map((d) => {
              const isSelected = selectedDocs.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDoc(d)}
                  className="text-14 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: isSelected ? '#111111' : '#F5F2EE',
                    color: isSelected ? '#FFFFFF' : '#6B6560',
                    border: isSelected ? '1px solid #111111' : '1px solid #E8E2DA',
                  }}
                >
                  {isSelected ? '✓ ' : ''}{d}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-14 text-text-secondary">
              {selectedDocs.length} document{selectedDocs.length !== 1 ? 's' : ''} selected
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="btn-primary py-3 px-8 text-14 cursor-pointer"
            >
              {saving ? (
                <span className="flex items-center gap-2"><span className="spinner" /> Calculating...</span>
              ) : (
                'Calculate Eligibility →'
              )}
            </button>
          </div>
        </div>
      </BlurReveal>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   DASHBOARD SUMMARY — Shows after doc selection
   All values start from 0, no mock fallback
   ═══════════════════════════════════════════════════ */

function DashboardSummary({ userDocs }) {
  const [data, setData] = useState(null);
  const [schemes, setSchemes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.dashboard.summary(),
      api.schemes.list(),
    ]).then(([dashRes, schemesRes]) => {
      if (dashRes.data && dashRes.data.top_matches && dashRes.data.top_matches.length > 0) {
        setData(dashRes.data);
      }
      if (schemesRes.data && schemesRes.data.length > 0) {
        setSchemes(schemesRes.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // No mock fallback — use empty defaults (0 values) while loading
  const matches = data?.top_matches || [];
  const criticalGaps = data?.critical_gaps || [];

  // Build scheme lookup map
  const schemeMap = {};
  (schemes || []).forEach((s) => { schemeMap[s.id] = s; });
  mockSchemes.forEach((s) => { if (!schemeMap[s.id]) schemeMap[s.id] = s; });

  // Compute document-based eligibility for each match
  const matchesWithDocEligibility = matches.map((m) => {
    const scheme = schemeMap[m.scheme_id];
    const requiredDocs = scheme?.required_documents || scheme?.required_docs || [];
    const totalRequired = requiredDocs.length;
    const missingCount = (m.missing_documents || []).length;
    const docsOwned = totalRequired - missingCount;
    const docEligibility = totalRequired > 0 ? Math.round((docsOwned / totalRequired) * 100) : 0;
    return { ...m, docEligibility };
  });

  // Compute stats from document-based eligibility (0 if no data yet)
  const eligScores = matchesWithDocEligibility.map((m) => m.docEligibility);
  const topDocScore = eligScores.length > 0 ? Math.max(...eligScores) : 0;
  const avgDocEligibility = eligScores.length > 0 ? Math.round((eligScores.reduce((a, b) => a + b, 0) / eligScores.length) * 10) / 10 : 0;

  return (
    <div>
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">Dashboard</h1>
        <p className="text-16 text-text-secondary mb-8">Your AI-powered funding overview</p>
      </CinematicReveal>

      {/* Stats — animated counters with depth */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Top Match Score', value: topDocScore, suffix: '%', color: topDocScore >= 75 ? '#1A5C38' : topDocScore >= 50 ? '#92600A' : '#8B1A1A' },
          { label: 'Avg Eligibility', value: avgDocEligibility, suffix: '%', color: '#0A0A0A', decimals: 1 },
          { label: 'Critical Doc Gaps', value: criticalGaps.length, suffix: '', color: '#8B1A1A' },
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="h-32 rounded-2xl skeleton"
              animate={{ scale: [0.99, 1.01, 0.99] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      ) : matchesWithDocEligibility.length === 0 ? (
        <BlurReveal delay={0.25} blur={4} distance={15}>
          <div className="text-center py-12 px-8 rounded-2xl mb-10" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
            <p className="text-18 text-text-secondary">No matched schemes yet</p>
            <p className="text-14 text-text-secondary mt-2">Run a scheme match from the Schemes page to see results here</p>
          </div>
        </BlurReveal>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {matchesWithDocEligibility.slice(0, 3).map((m, i) => {
            const barColor = m.docEligibility >= 75 ? '#1A5C38' : m.docEligibility >= 50 ? '#92600A' : '#8B1A1A';
            return (
              <BlurReveal key={i} delay={0.25 + i * 0.08} blur={6} distance={20}>
                <motion.div
                  className="p-5 rounded-2xl"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
                  whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
                  transition={{ duration: 0.3, ease }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-14 font-semibold text-text-primary">{m.scheme_name}</p>
                    <span className="text-14 font-mono font-semibold" style={{ color: barColor }}>{m.docEligibility}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full mb-3" style={{ backgroundColor: '#F5F2EE' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: barColor }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.docEligibility}%` }}
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
            );
          })}
        </div>
      )}

      {/* Recent Applications */}
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

/* ═══════════════════════════════════════════════════
   DASHBOARD PAGE — Always asks for docs first
   ═══════════════════════════════════════════════════ */

export default function DashboardPage() {
  const [docsConfirmed, setDocsConfirmed] = useState(false);
  const [userDocs, setUserDocs] = useState([]);

  const handleDocsComplete = (docs) => {
    setUserDocs(docs);
    setDocsConfirmed(true);
  };

  return docsConfirmed ? (
    <DashboardSummary userDocs={userDocs} />
  ) : (
    <DocumentPicker onComplete={handleDocsComplete} />
  );
}
