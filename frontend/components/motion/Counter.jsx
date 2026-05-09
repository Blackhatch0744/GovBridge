'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function Counter({
  from = 0,
  to,
  duration = 1.5,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0,
}) {
  const ref = useRef(null);
  const [value, setValue] = useState(from);
  const prevTo = useRef(to);
  const animFrameRef = useRef(null);

  const runAnimation = useCallback((startVal, endVal) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    const start = performance.now();
    const animate = (now) => {
      const elapsed = (now - start) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * eased;
      setValue(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current));
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
  }, [duration, decimals]);

  // Re-animate when `to` changes
  useEffect(() => {
    if (prevTo.current !== to) {
      runAnimation(prevTo.current, to);
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
          runAnimation(from, to);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [from, to, runAnimation]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value}{suffix}
    </span>
  );
}

