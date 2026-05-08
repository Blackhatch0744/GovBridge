'use client';

import { useEffect, useRef, useState } from 'react';

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
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const start = performance.now();
          const animate = (now) => {
            const elapsed = (now - start) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = from + (to - from) * eased;
            setValue(decimals > 0 ? parseFloat(current.toFixed(decimals)) : Math.round(current));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [from, to, duration, decimals, hasAnimated]);

  return (
    <span ref={ref} className={className}>
      {prefix}{value}{suffix}
    </span>
  );
}
