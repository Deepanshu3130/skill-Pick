import { useState, useEffect, useRef } from 'react';

/**
 * Shared IntersectionObserver hook for viewport-triggered entrances.
 * @param {Object} options - IntersectionObserverInit plus `once` (boolean).
 * @returns {[React.RefObject, boolean]} [ref, isInView]
 */
export function useInView({
  threshold = 0.15,
  rootMargin = '0px',
  once = true
} = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Check for prefers-reduced-motion: if reduced, show immediately
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return [ref, isInView];
}

export default useInView;
