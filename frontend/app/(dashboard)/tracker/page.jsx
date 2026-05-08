'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';
import ApplicationRow from '@/components/tracker/ApplicationRow';
import Timeline from '@/components/tracker/Timeline';
import { api } from '@/lib/api';
import { mockApplications } from '@/lib/mockData';

const ease = [0.16, 1, 0.3, 1];

export default function TrackerPage() {
  const [selected, setSelected] = useState(null);
  const [apps, setApps] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    api.applications.list().then(({ data }) => {
      if (data && data.length > 0) setApps(data);
      else setApps(mockApplications);
    });
  }, [loaded]);

  const list = apps || mockApplications;

  return (
    <div>
      <CinematicReveal preset="gentle">
        <h1 className="text-32 font-light text-text-primary tracking-tight mb-2">Application Tracker</h1>
        <p className="text-16 text-text-secondary mb-8">Monitor your application progress</p>
      </CinematicReveal>

      <BlurReveal delay={0.1} blur={4} distance={15}>
        <div className="hidden md:flex items-center px-5 py-3 mb-2">
          <span className="flex-1 text-12 text-text-secondary font-medium uppercase tracking-wider">Scheme</span>
          <span className="w-20 text-12 text-text-secondary font-medium uppercase tracking-wider text-right">Score</span>
          <span className="w-32 text-12 text-text-secondary font-medium uppercase tracking-wider text-right">Status</span>
        </div>
      </BlurReveal>

      {/* Staggered application rows */}
      <div className="space-y-2 mb-8">
        {list.map((app, i) => (
          <BlurReveal key={app.id} delay={0.12 + i * 0.06} blur={4} distance={15}>
            <ApplicationRow app={app} onSelect={setSelected} isSelected={selected?.id === app.id} />
          </BlurReveal>
        ))}
      </div>

      {/* Timeline with AnimatePresence */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease }}
          >
            <Timeline application={selected} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
