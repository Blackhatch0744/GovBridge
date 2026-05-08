'use client';

import { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════
   SMOOTH COUNTER — Performance Optimized
   Uses requestAnimationFrame (not setInterval).
   IntersectionObserver triggers once per viewport.
   rootMargin: -10% for seamless trigger.
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
  const hasAnimatedRef = useRef(false);
  const [blurAmount, setBlurAmount] = useState(blur ? 6 : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          observer.disconnect();

          const timeout = setTimeout(() => {
            const start = performance.now();
            const dur = duration * 1000;

            const animate = (now) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / dur, 1);

              /* Quintic ease-out for premium deceleration */
              const t = 1 - Math.pow(1 - progress, 4);

              const current = from + (to - from) * t;
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
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
          }, delay * 1000);

          return () => clearTimeout(timeout);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px',
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [from, to, duration, decimals, blur, delay]);

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
