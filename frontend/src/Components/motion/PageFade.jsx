import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageFade Component.
 * 250ms fade and translateY 8px on route change.
 * Non-blocking, transform and opacity only.
 * Off for prefers-reduced-motion.
 */
export function PageFade({ children, className = "" }) {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(isReduced);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    // Trigger brief entrance on route change
    setVisible(false);
    const timer = setTimeout(() => {
      setVisible(true);
    }, 20);

    return () => clearTimeout(timer);
  }, [location.pathname, reducedMotion]);

  if (reducedMotion) {
    return <div className={`w-full ${className}`}>{children}</div>;
  }

  return (
    <div
      className={`w-full transition-[opacity,transform] duration-[250ms] ease-out will-change-transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${className}`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }}
    >
      {children}
    </div>
  );
}

export default PageFade;
