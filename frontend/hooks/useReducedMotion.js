'use client';

import { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════════════
   useReducedMotion Hook
   Returns true if:
   - prefers-reduced-motion is set, OR
   - viewport width < 768px (mobile)
   Preserves elegance without heavy transforms.
   ═══════════════════════════════════════════════════ */

export default function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isMobile = () => window.innerWidth < 768;

    const update = () => {
      setReduced(mql.matches || isMobile());
    };

    update();

    mql.addEventListener('change', update);
    window.addEventListener('resize', update, { passive: true });

    return () => {
      mql.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return reduced;
}
