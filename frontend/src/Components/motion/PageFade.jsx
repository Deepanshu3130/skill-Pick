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
  const [animating, setAnimating] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(isReduced);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    // Trigger brief entrance on route change
    setVisible(false);
    setAnimating(true);
    const enterTimer = setTimeout(() => {
      setVisible(true);
    }, 20);

    // After animation completes, clear transform and will-change to release position:fixed and sticky children
    const doneTimer = setTimeout(() => {
      setAnimating(false);
    }, 280);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(doneTimer);
    };
  }, [location.pathname, reducedMotion]);

  if (reducedMotion || !animating) {
    return (
      <div className={`w-full ${className}`}>
        {children}
      </div>
    );
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
