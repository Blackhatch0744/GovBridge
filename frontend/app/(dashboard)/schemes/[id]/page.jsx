'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, ExternalLink } from 'lucide-react';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';
import ReadinessRing from '@/components/compliance/ReadinessRing';
import SmoothCounter from '@/components/motion/SmoothCounter';
import { api } from '@/lib/api';
import { mockSchemes, mockUserMatches } from '@/lib/mockData';

const ease = [0.16, 1, 0.3, 1];

export default function SchemeDetailPage() {
  const params = useParams();
  const [scheme, setScheme] = useState(null);
  const [match, setMatch] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    api.schemes.get(params.id).then(({ data }) => {
      setScheme(data || mockSchemes.find((s) => s.id === params.id) || mockSchemes[0]);
    });
    api.dashboard.summary().then(({ data }) => {
      const m = data?.top_matches?.find((m) => String(m.scheme_id) === String(params.id));
      const foundMatch = m || mockUserMatches.find((m) => String(m.scheme_id) === String(params.id));
      setMatch(foundMatch);

      if (foundMatch && foundMatch.reasoning) {
        setAnalysis(foundMatch.reasoning);
      } else {
        setAnalyzing(true);
        api.schemes.analyze(params.id).then((res) => {
          if (res.data) setAnalysis(res.data.analysis);
          else setAnalysis('Could not generate AI analysis at this time.');
          setAnalyzing(false);
        });
      }
    });
  }, [loaded, params.id]);

  if (!scheme) return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-20 rounded-2xl skeleton"
          animate={{ scale: [0.99, 1.01, 0.99] }}
          transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );

  const required = scheme.required_documents || scheme.required_docs || [];
  const missing = match?.missing_documents || [];

  // Compute document-based eligibility: (docs the user HAS / total required) * 100
  const totalRequired = required.length;
  const docsOwned = totalRequired - missing.length;
  const docEligibility = totalRequired > 0 ? Math.round((docsOwned / totalRequired) * 100) : 0;

  return (
    <div>
      <BlurReveal blur={4} distance={10}>
        <Link href="/schemes" className="text-14 text-text-secondary hover:text-text-primary transition-colors mb-6 inline-block">← Back to Schemes</Link>
      </BlurReveal>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1">
          <CinematicReveal preset="gentle">
            <span className="inline-block text-12 font-medium px-3 py-1 rounded-full mb-4" style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}>{scheme.ministry}</span>
            <h1 className="text-32 font-light text-text-primary tracking-tight mb-4">{scheme.name}</h1>
            <p className="text-16 text-text-secondary leading-relaxed mb-8">{scheme.description}</p>
          </CinematicReveal>

          {/* Document checklist — staggered transitions */}
          <BlurReveal delay={0.15} blur={6} distance={20}>
            <div className="p-6 rounded-2xl mb-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
              <h3 className="text-16 font-semibold text-text-primary mb-4">Required Documents</h3>
              <div className="space-y-3">
                {required.map((doc, i) => {
                  const isMissing = missing.includes(doc);
                  return (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.06, duration: 0.4, ease }}
                    >
                      {isMissing
                        ? <motion.div animate={{ x: [0, -2, 2, -1, 0] }} transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}><AlertTriangle size={16} style={{ color: '#92600A' }} /></motion.div>
                        : <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.06, duration: 0.3, ease }}><Check size={16} style={{ color: '#1A5C38' }} /></motion.div>
                      }
                      <span className="text-14" style={{ color: isMissing ? '#92600A' : '#0A0A0A' }}>{doc}</span>
                      {isMissing && (
                        <motion.span
                          className="text-12 px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: '#FFF8E1', color: '#92600A' }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.06, duration: 0.3, ease }}
                        >
                          Missing
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </BlurReveal>

          {/* AI Analysis */}
          <BlurReveal delay={0.25} blur={6} distance={20}>
            <div className="p-6 rounded-2xl" style={{ backgroundColor: '#F5F2EE', border: '1px solid #E8E2DA' }}>
              <h3 className="text-16 font-semibold text-text-primary mb-2">AI Analysis</h3>
              <div className="text-14 text-text-secondary leading-relaxed">
                {analyzing ? (
                  <p className="flex items-center gap-2">
                    <span className="spinner" style={{ borderColor: '#6B6560', borderTopColor: 'transparent' }} /> 
                    Generating analysis...
                  </p>
                ) : (
                  <p>{analysis}</p>
                )}
              </div>
            </div>
          </BlurReveal>
        </div>

        {/* Sticky side panel */}
        <div className="lg:w-[340px] flex-shrink-0">
          <div className="lg:sticky lg:top-6 space-y-4">
            <BlurReveal delay={0.2} blur={8} distance={25}>
              <motion.div
                className="p-6 rounded-2xl text-center"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
                whileHover={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
                transition={{ duration: 0.3, ease }}
              >
                <ReadinessRing score={match ? docEligibility : 0} size={140} />
                <div className="mt-4 mb-2">
                  <p className="text-14 text-text-secondary">Funding Range</p>
                  <p className="text-24 font-mono font-medium text-text-primary mt-1">
                    ₹<SmoothCounter to={Math.round((scheme.funding_min || 0) / 100000)} duration={1} delay={0.5} />L – ₹<SmoothCounter to={Math.round((scheme.funding_max || 0) / 100000)} duration={1} delay={0.6} />L
                  </p>
                </div>
                <span className="inline-block text-12 px-3 py-1 rounded-full mb-4" style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}>Deadline: {scheme.deadline || 'Rolling'}</span>

                {missing.length > 0 && (
                  <motion.div
                    className="mt-4 pt-4 text-left"
                    style={{ borderTop: '1px solid #E8E2DA' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.4, ease }}
                  >
                    <p className="text-12 font-medium text-text-secondary uppercase tracking-wider mb-2">Missing Docs</p>
                    <div className="flex flex-wrap gap-2">
                      {missing.map((d, i) => (
                        <motion.span
                          key={i}
                          className="text-12 px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: '#FFEBEE', color: '#8B1A1A' }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + i * 0.05, duration: 0.3, ease }}
                        >
                          {d}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/compliance" className="btn-primary w-full py-3 text-14 mt-6 block text-center">Start Compliance Check</Link>
                </motion.div>
              </motion.div>
            </BlurReveal>

            {scheme.source_url && (
              <BlurReveal delay={0.35} blur={4} distance={15}>
                <motion.a
                  href={scheme.source_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 rounded-2xl text-14 text-text-secondary hover:text-text-primary transition-colors"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
                  whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}
                  transition={{ duration: 0.25, ease }}
                >
                  <ExternalLink size={16} /> View Official Source
                </motion.a>
              </BlurReveal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
