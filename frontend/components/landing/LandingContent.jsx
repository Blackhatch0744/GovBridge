'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/landing/Hero';
import WorkflowSection from '@/components/landing/WorkflowSection';
import FeatureCards from '@/components/landing/FeatureCards';
import Footer from '@/components/shared/Footer';

/* ═══════════════════════════════════════════════════
   LANDING — Lazy-loaded below-fold sections
   Hero, Workflow, Features stay eager (above fold).
   StorySection, DashboardPreview, CTA are lazy.
   ═══════════════════════════════════════════════════ */

const StorySection = dynamic(() => import('@/components/landing/StorySection'), {
  loading: () => <div style={{ minHeight: '100vh' }} />,
  ssr: false,
});

const DashboardPreview = dynamic(() => import('@/components/landing/DashboardPreview'), {
  loading: () => <div style={{ minHeight: '60vh' }} />,
  ssr: false,
});

const CTASection = dynamic(() => import('@/components/landing/CTASection'), {
  loading: () => <div style={{ minHeight: '40vh' }} />,
  ssr: false,
});

export default function LandingContent() {
  return (
    <main>
      <Navbar />
      <Hero />
      <WorkflowSection />
      <FeatureCards />
      <StorySection />
      <DashboardPreview />
      <CTASection />
      <Footer />
    </main>
  );
}
