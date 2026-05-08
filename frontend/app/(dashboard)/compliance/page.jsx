'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';
import DocumentUpload from '@/components/compliance/DocumentUpload';
import ReadinessRing from '@/components/compliance/ReadinessRing';
import MissingDocsList from '@/components/compliance/MissingDocsList';
import { api } from '@/lib/api';
import { documentTypes, mockSchemes } from '@/lib/mockData';
import Link from 'next/link';

const ease = [0.16, 1, 0.3, 1];

export default function CompliancePage() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [schemeId, setSchemeId] = useState('');
  const [schemes, setSchemes] = useState(mockSchemes);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    api.schemes.list().then(({ data }) => {
      if (data && data.length > 0) { setSchemes(data); setSchemeId(String(data[0].id)); }
      else setSchemeId(mockSchemes[0]?.id || '1');
    });
  }, [loaded]);

  const toggleDoc = (doc) => setSelected((prev) => prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]);

  const handleCheck = async () => {
    if (loading || result) return;
    setLoading(true);
    const { data, error } = await api.compliance.check({ scheme_id: parseInt(schemeId), uploaded_document_types: selected });
    if (data) {
      setResult(data);
    } else {
      const scheme = schemes.find((s) => String(s.id) === String(schemeId));
      const required = scheme?.required_documents || scheme?.required_docs || [];
      const matching = required.filter((d) => selected.includes(d));
      const missing = required.filter((d) => !selected.includes(d));
      setResult({ readiness_score: required.length ? Math.round((matching.length / required.length) * 100) : 100, missing_documents: missing, matching_documents: matching });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[800px]">
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">Compliance Checker</h1>
        <p className="text-16 text-text-secondary mb-8">Verify your documents against scheme requirements</p>
      </CinematicReveal>

      <BlurReveal delay={0.1} blur={6} distance={20}>
        <div className="p-6 rounded-2xl mb-6 relative" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
          {/* Subtle ambient gradient */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(212,197,176,0.05) 0%, transparent 70%)',
            }}
          />
          <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">Select Scheme</label>
          <select value={schemeId} onChange={(e) => { setSchemeId(e.target.value); setResult(null); }} className="input-field text-14 mb-6" style={{ cursor: 'pointer' }}>
            {schemes.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
          </select>
          <DocumentUpload selected={selected} options={documentTypes} onToggle={toggleDoc} />
        </div>
      </BlurReveal>

      <BlurReveal delay={0.2} blur={4} distance={15}>
        <motion.button
          onClick={handleCheck}
          disabled={loading || !!result}
          className="btn-primary w-full py-4 text-16 mb-8"
          whileHover={!result ? { scale: 1.02 } : {}}
          whileTap={!result ? { scale: 0.98 } : {}}
        >
          {loading ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Checking...</span> : result ? '✓ Compliance Checked' : 'Check Compliance'}
        </motion.button>
      </BlurReveal>

      {result && (
        <CinematicReveal preset="gentle">
          <motion.div
            className="p-8 rounded-2xl mb-6 relative overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E8E2DA',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            }}
            initial={{ opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, ease }}
          >
            {/* Ambient background movement */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  'radial-gradient(ellipse 50% 50% at 30% 50%, rgba(212,197,176,0.04) 0%, transparent 70%)',
                  'radial-gradient(ellipse 50% 50% at 70% 50%, rgba(212,197,176,0.06) 0%, transparent 70%)',
                  'radial-gradient(ellipse 50% 50% at 30% 50%, rgba(212,197,176,0.04) 0%, transparent 70%)',
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <ReadinessRing score={result.readiness_score} size={160} />
              <div className="flex-1">
                <MissingDocsList missing={result.missing_documents} matching={result.matching_documents} />
              </div>
            </div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/proposal" className="btn-primary inline-flex items-center gap-2 py-3 px-6 text-14">Start Proposal →</Link>
          </motion.div>
        </CinematicReveal>
      )}
    </div>
  );
}
