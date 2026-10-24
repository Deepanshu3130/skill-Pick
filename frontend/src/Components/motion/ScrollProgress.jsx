import React, { useEffect, useRef } from 'react';

/**
 * ScrollProgress Component.
 * 2px high bar fixed at the very top of the screen.
 * Tracks global page scroll via CSS scaleX on requestAnimationFrame without React state.
 * Off for prefers-reduced-motion.
 */
export function ScrollProgress({ className = "" }) {
  const barRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      bar.style.display = 'none';
      return;
    }

    let rafId = null;

    const updateProgress = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

      bar.style.transform = `scaleX(${progress})`;
      rafId = null;
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[9999] pointer-events-none transition-transform duration-75 will-change-transform ${className}`}
      style={{ transform: 'scaleX(0)' }}
    />
  );
}

export default ScrollProgress;
