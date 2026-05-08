'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';
import SchemeCard from '@/components/schemes/SchemeCard';
import FilterBar from '@/components/schemes/FilterBar';
import { api } from '@/lib/api';
import { mockSchemes, mockUserMatches } from '@/lib/mockData';

const ease = [0.16, 1, 0.3, 1];

export default function SchemesPage() {
  const [filters, setFilters] = useState({ search: '', entity: '', minFunding: '' });
  const [schemes, setSchemes] = useState(null);
  const [matches, setMatches] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    api.dashboard.summary().then(({ data }) => {
      if (data && data.top_matches && data.top_matches.length > 0) {
        setMatches(data.top_matches);
      } else {
        setMatches(mockUserMatches);
      }
    });
    api.schemes.list().then(({ data }) => {
      if (data && data.length > 0) setSchemes(data);
      else setSchemes(mockSchemes);
    });
  }, [loaded]);

  const allSchemes = schemes || mockSchemes;
  const allMatches = matches || mockUserMatches;
  const matchMap = useMemo(() => {
    const map = {};
    allMatches.forEach((m) => { map[m.scheme_id || m.id] = m; });
    return map;
  }, [allMatches]);

  const filtered = useMemo(() => allSchemes.filter((s) => {
    if (filters.search && !s.name.toLowerCase().includes(filters.search.toLowerCase()) && !(s.ministry || '').toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.minFunding && (s.funding_min || 0) < parseInt(filters.minFunding)) return false;
    return true;
  }), [allSchemes, filters]);

  const loading = !schemes && !matches;

  return (
    <div>
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">Matched Schemes</h1>
        <p className="text-16 text-text-secondary mb-8">AI-scored schemes ranked by your eligibility</p>
      </CinematicReveal>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter sidebar — slide in from left */}
        <div className="md:w-[240px] flex-shrink-0">
          <BlurReveal direction="left" distance={20} blur={6} delay={0.1}>
            <div className="md:sticky md:top-6 p-6 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
              <p className="text-14 font-semibold text-text-primary mb-4">Filters</p>
              <FilterBar onFilter={setFilters} />
            </div>
          </BlurReveal>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="h-64 rounded-2xl skeleton"
                  animate={{ scale: [0.99, 1.01, 0.99] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <CinematicReveal>
              <div className="text-center py-20 px-8 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
                <p className="text-18 text-text-secondary">No schemes match your profile</p>
                <p className="text-14 text-text-secondary mt-2">Try adjusting your filters</p>
              </div>
            </CinematicReveal>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((scheme, i) => (
                <BlurReveal key={scheme.id} delay={i * 0.06} blur={6} distance={20}>
                  <SchemeCard scheme={scheme} match={matchMap[scheme.id]} />
                </BlurReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
