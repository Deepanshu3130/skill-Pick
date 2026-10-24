import { useEffect, useRef } from 'react';

/**
 * Tracks element or page scroll progress (0..1) without triggering React state re-renders.
 * Writes a CSS custom property `--progress` on the target element inside requestAnimationFrame.
 * 
 * @param {React.RefObject} targetRef - Ref to the element being measured.
 * @param {Object} options - Custom offsets and options.
 * @returns {React.RefObject} The target ref passed in.
 */
export function useScrollProgress(targetRef, { startOffset = 0.2, endOffset = 0.8 } = {}) {
  const rafId = useRef(null);

  useEffect(() => {
    const node = targetRef?.current;
    if (!node) return;

    // Check for prefers-reduced-motion: set to 1 immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      node.style.setProperty('--progress', '1');
      return;
    }

    const calculateProgress = () => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Start calculating when top of container enters viewport (offset by startOffset)
      const start = viewportHeight * (1 - startOffset);
      const end = viewportHeight * (1 - endOffset) - rect.height;
      const current = rect.top;

      let progress = (start - current) / (start - end);
      progress = Math.max(0, Math.min(1, progress));

      node.style.setProperty('--progress', progress.toFixed(4));
    };

    const onScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        calculateProgress();
        rafId.current = null;
      });
    };

    const onResize = () => {
      calculateProgress();
    };

    // Initial calculation
    calculateProgress();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [targetRef, startOffset, endOffset]);

  return targetRef;
}

export default useScrollProgress;
