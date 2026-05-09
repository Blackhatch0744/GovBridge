'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';
import ProposalPreview from '@/components/proposal/ProposalPreview';
import ImpactCard from '@/components/proposal/ImpactCard';
import { api } from '@/lib/api';
import { mockSchemes } from '@/lib/mockData';

const ease = [0.16, 1, 0.3, 1];

export default function ProposalPage() {
  const [proposal, setProposal] = useState(null);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [impactLoading, setImpactLoading] = useState(false);
  const [schemes, setSchemes] = useState(mockSchemes);
  const [schemeId, setSchemeId] = useState('');
  const [userDocs, setUserDocs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    api.schemes.list().then(({ data }) => {
      if (data && data.length > 0) { setSchemes(data); setSchemeId(String(data[0].id)); }
      else setSchemeId(mockSchemes[0]?.id || '1');
    });
    // Fetch user's actual uploaded documents
    api.compliance.documents().then(({ data }) => {
      if (data && data.length > 0) setUserDocs(data);
    });
  }, [loaded]);

  const handleGenerate = async () => {
    if (loading || proposal) return;
    setLoading(true);
    // Pass real document IDs to the backend
    const docIds = userDocs.map((d) => d.id);
    const { data, error } = await api.proposals.generate({ scheme_id: parseInt(schemeId), document_ids: docIds });
    if (data) setProposal(data);
    else {
      setProposal({
        proposal_text: 'Proposal generated with fallback',
        sections: {
          executive_summary: 'This enterprise seeks funding to expand operations, driving growth and employment in the local community.',
          funding_utilization: 'Equipment modernization (40%), Raw materials (25%), Staff training (20%), Working capital (15%).',
          growth_plan: '12-month plan targeting 30% revenue growth through market expansion and product diversification.',
          employment_impact: 'Projected to create 5-10 direct jobs and 15-20 indirect employment opportunities.',
        },
      });
    }
    setLoading(false);
  };

  const handleImpact = async () => {
    if (impactLoading || impact) return;
    setImpactLoading(true);
    const scheme = schemes.find((s) => String(s.id) === String(schemeId));
    const { data, error } = await api.proposals.impact({
      business_type: 'MSME', location: 'Chennai',
      scheme_name: scheme?.name || 'PMEGP', funding_amount: scheme?.funding_max || 2500000,
    });
    if (data) setImpact(data.impact_statement);
    else setImpact('This enterprise is projected to create 5-10 direct employment opportunities in the local community. The investment will stimulate neighbourhood commerce and support ancillary businesses.');
    setImpactLoading(false);
  };

  return (
    <div>
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">Proposal Generator</h1>
        <p className="text-16 text-text-secondary mb-8">AI-powered grant proposal writing</p>
      </CinematicReveal>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left panel — editor with depth */}
        <div className="lg:w-[320px] flex-shrink-0">
          <BlurReveal direction="left" distance={20} blur={6} delay={0.1}>
            <motion.div
              className="p-6 rounded-2xl lg:sticky lg:top-6 space-y-6 relative"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E2DA',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div>
                <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">Select Scheme</label>
                <select value={schemeId} onChange={(e) => { setSchemeId(e.target.value); setProposal(null); setImpact(null); }} className="input-field text-14" style={{ cursor: 'pointer' }}>
                  {schemes.map((s) => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-12 text-text-secondary mb-2 font-medium uppercase tracking-wider">
                  Your Documents ({userDocs.length})
                </label>
                {userDocs.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userDocs.map((d, i) => (
                      <motion.span
                        key={d.id || i}
                        className="text-12 px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: '#E8F5E9', color: '#1A5C38' }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 + 0.2, duration: 0.3, ease }}
                      >
                        ✓ {d.document_type}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <p className="text-12 text-text-secondary px-3 py-2 rounded-xl" style={{ backgroundColor: '#FFF8E1' }}>
                    No documents uploaded. Visit your Profile to add documents for better proposals.
                  </p>
                )}
              </div>

              <motion.button
                onClick={handleGenerate}
                disabled={loading || !!proposal}
                className="btn-primary w-full py-4 text-14"
                whileHover={!proposal ? { scale: 1.02 } : {}}
                whileTap={!proposal ? { scale: 0.98 } : {}}
              >
                {loading ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Generating...</span> : proposal ? '✓ Proposal Generated' : 'Generate Proposal'}
              </motion.button>

              {proposal && !impact && (
                <motion.button
                  onClick={handleImpact}
                  disabled={impactLoading}
                  className="btn-secondary w-full py-3 text-14"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4, ease }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {impactLoading ? <span className="flex items-center justify-center gap-2"><span className="spinner" /> Generating...</span> : 'Generate Impact Statement'}
                </motion.button>
              )}
            </motion.div>
          </BlurReveal>
        </div>

        {/* Right panel — paper preview */}
        <div className="flex-1">
          <ProposalPreview proposal={proposal} />
          <ImpactCard impact={impact} />
        </div>
      </div>
    </div>
  );
}

