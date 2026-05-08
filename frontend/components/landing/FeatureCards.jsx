'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Brain, ShieldCheck, Briefcase } from 'lucide-react';
import CinematicReveal from '@/components/motion/CinematicReveal';
import BlurReveal from '@/components/motion/BlurReveal';

/* ═══════════════════════════════════════════════════
   FEATURE CARDS — Premium Interactive Experience
   Pseudo-3D tilt, spotlight hover, floating icons,
   layered depth shadows, premium border animations
   ═══════════════════════════════════════════════════ */

const ease = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: Brain,
    title: 'Smart Scheme Matching',
    description: 'AI analyzes your profile against 15+ government schemes and scores eligibility in real-time.',
    stat: '83% match accuracy',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Intelligence',
    description: 'Instant document verification checks what you have against what each scheme requires.',
    stat: 'Readiness score in seconds',
  },
  {
    icon: Briefcase,
    title: 'Funding to Employment',
    description: 'When your application gets funded, AI auto-generates job listings to hire locally.',
    stat: 'Closes the full loop',
  },
];

/* ── Feature Card with 3D tilt + spotlight ── */
function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.8 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const percentX = (x - 0.5) * 2;
    const percentY = (y - 0.5) * 2;

    rotateX.set(-percentY * 4);
    rotateY.set(percentX * 4);
    spotlightX.set(x * 100);
    spotlightY.set(y * 100);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    spotlightX.set(50);
    spotlightY.set(50);
  };

  return (
    <CinematicReveal delay={index * 0.12} preset="gentle">
      <div style={{ perspective: '1200px' }}>
        <motion.div
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
          className="p-10 rounded-2xl cursor-default h-full flex flex-col relative overflow-hidden"
          animate={{
            backgroundColor: '#FFFFFF',
            borderColor: isHovered ? '#D4C5B0' : '#E8E2DA',
            boxShadow: isHovered
              ? '0 16px 50px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)'
              : '0 1px 3px rgba(0,0,0,0.04)',
          }}
          transition={{ duration: 0.3, ease }}
          whileTap={{ scale: 0.99 }}
        >
          {/* Spotlight gradient overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            animate={{
              background: isHovered
                ? `radial-gradient(circle at ${spotlightX.get()}% ${spotlightY.get()}%, rgba(212,197,176,0.08) 0%, transparent 60%)`
                : 'none',
            }}
            transition={{ duration: 0.1 }}
          />

          {/* Animated border line at top */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px]"
            style={{ backgroundColor: '#D4C5B0' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease }}
            style={{ transformOrigin: 'left', backgroundColor: '#D4C5B0' }}
          />

          {/* Icon — floating on hover */}
          <motion.div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative z-10"
            style={{ backgroundColor: '#F5F2EE' }}
            animate={{
              y: isHovered ? -3 : 0,
              backgroundColor: isHovered ? '#EDE8E0' : '#F5F2EE',
            }}
            transition={{ duration: 0.4, ease }}
          >
            <motion.div
              animate={{ rotate: isHovered ? -5 : 0 }}
              transition={{ duration: 0.4, ease }}
            >
              <Icon size={28} color="#0A0A0A" strokeWidth={1.5} />
            </motion.div>
          </motion.div>

          <h3 className="text-24 font-medium text-text-primary mb-3 tracking-tight relative z-10">
            {feature.title}
          </h3>

          <p className="text-16 text-text-secondary leading-relaxed mb-8 flex-1 relative z-10">
            {feature.description}
          </p>

          {/* Stat badge with draw-in animation */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-start relative z-10"
            style={{ backgroundColor: '#F5F2EE' }}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.12 + 0.3, ease }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#1A5C38' }}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.12 + 0.4, ease }}
            />
            <span className="text-12 font-medium font-mono" style={{ color: '#1A5C38' }}>
              {feature.stat}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </CinematicReveal>
  );
}

export default function FeatureCards() {
  return (
    <section id="features" className="py-24 px-6" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Section heading */}
        <CinematicReveal>
          <div className="text-center mb-16">
            <motion.span
              className="inline-block text-12 font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: '#F5F2EE', color: '#6B6560' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              Capabilities
            </motion.span>
            <BlurReveal duration={0.8} blur={10} distance={30}>
              <h2 className="text-48 font-light text-text-primary tracking-tight">
                Three Engines, One Platform
              </h2>
            </BlurReveal>
          </div>
        </CinematicReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
