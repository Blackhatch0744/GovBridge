'use client';

import { ReactLenis } from 'lenis/react';

/* ═══════════════════════════════════════════════════
   SMOOTH SCROLL — Cinematic
   Premium Lenis configuration with:
   - Lower lerp for weighted, cinematic inertia
   - Longer duration for luxurious momentum
   - Soft velocity interpolation
   - Premium scroll feel
   ═══════════════════════════════════════════════════ */

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.07,
        duration: 1.6,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.8,
        infinite: false,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        syncTouch: false,
        syncTouchLerp: 0.06,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      {children}
    </ReactLenis>
  );
}
