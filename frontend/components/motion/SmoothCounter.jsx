'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ═══════════════════════════════════════════════════
   SMOOTH COUNTER — Performance Optimized
   Uses requestAnimationFrame (not setInterval).
   IntersectionObserver triggers once per viewport.
   Re-animates when `to` value changes.
   ═══════════════════════════════════════════════════ */

export default function SmoothCounter({
  from = 0,
  to,
  duration = 1.5,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
  blur = true,
  delay = 0,
}) {
  const ref = useRef(null);
  const [value, setValue] = useState(from);
  const prevTo = useRef(to);
  const animFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const [blurAmount, setBlurAmount] = useState(blur ? 6 : 0);

  const runAnimation = useCallback((startVal, endVal, animDelay = 0) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      const start = performance.now();
      const dur = duration * 1000;

      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);

        /* Quintic ease-out for premium deceleration */
        const t = 1 - Math.pow(1 - progress, 4);

        const current = startVal + (endVal - startVal) * t;
        setValue(
          decimals > 0
            ? parseFloat(current.toFixed(decimals))
            : Math.round(current)
        );

        /* Blur reduces as counter progresses */
        if (blur) {
          setBlurAmount(6 * (1 - progress));
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        }
      };

      animFrameRef.current = requestAnimationFrame(animate);
    }, animDelay * 1000);
  }, [duration, decimals, blur]);

  // Re-animate when `to` changes
  useEffect(() => {
    if (prevTo.current !== to) {
      runAnimation(prevTo.current, to, 0);
      prevTo.current = to;
    }
  }, [to, runAnimation]);

  // Initial animation on scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          observer.disconnect();
          runAnimation(from, to, delay);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [from, to, delay, runAnimation]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        filter: blur ? `blur(${blurAmount}px)` : 'none',
        transition: 'filter 0.1s ease-out',
        display: 'inline-block',
        willChange: 'filter',
      }}
    >
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

