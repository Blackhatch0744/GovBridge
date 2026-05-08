'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';
import SmoothCounter from '@/components/motion/SmoothCounter';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import { api } from '@/lib/api';
import { mockJobs } from '@/lib/mockData';

const ease = [0.16, 1, 0.3, 1];

export default function JobsPage() {
  const [filters, setFilters] = useState({ location: '', minPay: '' });
  const [jobs, setJobs] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    api.jobs.list().then(({ data }) => {
      if (data && data.length > 0) {
        setJobs(data.map((j) => ({
          id: j.id, title: j.role_title, business: `Business #${j.business_user_id}`,
          location: j.location || 'India', pay_min: j.pay_min, pay_max: j.pay_max,
          funded_by: `Application #${j.application_id}`, skills: j.skills || [],
        })));
      } else setJobs(mockJobs);
    });
  }, [loaded]);

  const allJobs = jobs || mockJobs;

  const filtered = useMemo(() => allJobs.filter((j) => {
    if (filters.location && !j.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.minPay && j.pay_min < parseInt(filters.minPay)) return false;
    return true;
  }), [allJobs, filters]);

  return (
    <div>
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">Jobs Board</h1>
        <p className="text-16 text-text-secondary mb-8">Jobs created from government-funded businesses</p>
      </CinematicReveal>

      {/* Stats row with reveal choreography */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Jobs', value: allJobs.length, color: '#0A0A0A' },
          { label: 'Locations', value: [...new Set(allJobs.map((j) => j.location))].length, color: '#0A0A0A' },
          { label: 'Avg Min Pay', value: Math.round(allJobs.reduce((a, j) => a + j.pay_min, 0) / (allJobs.length || 1) / 1000), suffix: 'k', color: '#1A5C38' },
          { label: 'Active Hiring', value: allJobs.length, color: '#1A5C38' },
        ].map((s, i) => (
          <BlurReveal key={i} delay={i * 0.08} blur={6} distance={15}>
            <motion.div
              className="p-5 rounded-xl"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}
              whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}
              transition={{ duration: 0.25, ease }}
            >
              <p className="text-12 text-text-secondary mb-1">{s.label}</p>
              <p className="text-24 font-light font-mono" style={{ color: s.color }}>
                <SmoothCounter to={s.value} suffix={s.suffix || ''} duration={1} delay={0.2 + i * 0.08} blur />
              </p>
            </motion.div>
          </BlurReveal>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filter sidebar */}
        <div className="md:w-[240px] flex-shrink-0">
          <BlurReveal direction="left" distance={20} blur={6} delay={0.15}>
            <div className="md:sticky md:top-6 p-6 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
              <p className="text-14 font-semibold text-text-primary mb-4">Filters</p>
              <JobFilters onFilter={setFilters} />
            </div>
          </BlurReveal>
        </div>

        {/* Job cards */}
        <div className="flex-1">
          {!jobs ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="h-48 rounded-2xl skeleton"
                  animate={{ scale: [0.99, 1.01, 0.99] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <CinematicReveal>
              <div className="text-center py-20 px-8 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E2DA' }}>
                <p className="text-18 text-text-secondary">No jobs match your filters</p>
              </div>
            </CinematicReveal>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((job, i) => (
                <BlurReveal key={job.id} delay={0.15 + i * 0.06} blur={6} distance={20}>
                  <JobCard job={job} />
                </BlurReveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
