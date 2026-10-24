import React, { useState, useEffect } from 'react';
import useInView from './useInView';

/**
 * Animated counting number component.
 * Counts up from 0 to value over 800ms once when visible.
 */
function CountUpNumber({ value = 0, duration = 800, isVisible, reducedMotion }) {
  const [displayValue, setDisplayValue] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(value);
      return;
    }

    if (!isVisible || !value) return;

    let startTime = null;
    let rafId = null;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const easedProgress = easeOutCubic(progress);

      setDisplayValue(Math.floor(easedProgress * value));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isVisible, value, duration, reducedMotion]);

  return (
    <span className="font-mono tabular-nums font-extrabold tracking-tight">
      {displayValue.toLocaleString()}
    </span>
  );
}

/**
 * StatsRow Component.
 * Displays 3-4 verified platform statistics separated by thin 1px dividers.
 * Hides completely if data is missing or failed.
 * 
 * @param {Object} props
 * @param {Object} [props.stats] - { topics, courses, repos, rooms }
 * @param {string} [props.className]
 */
export function StatsRow({ stats, className = "" }) {
  const [ref, isVisible] = useInView({ threshold: 0.2, once: true });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Real data only: Hide row completely if stats are missing or all zero
  if (!stats || (!stats.courses && !stats.repos && !stats.topics)) {
    return null;
  }

  const items = [
    { label: "Verified Courses", value: stats.courses, prefix: "" },
    { label: "GitHub Repositories", value: stats.repos, prefix: "" },
    { label: "Indexed Topics", value: stats.topics, prefix: "" },
    ...(stats.rooms > 0 ? [{ label: "Study Rooms", value: stats.rooms, prefix: "" }] : [])
  ];

  return (
    <div
      ref={ref}
      className={`w-full max-w-5xl mx-auto border-y border-base-300/80 bg-base-100/50 py-6 my-6 ${className}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-base-300/60 text-center">
        {items.map((item, idx) => (
          <div key={item.label} className="py-3 px-4 sm:px-6 space-y-1">
            <div className="text-2xl sm:text-3xl md:text-4xl text-base-content font-bold">
              <CountUpNumber
                value={item.value}
                duration={800}
                isVisible={isVisible}
                reducedMotion={reducedMotion}
              />
              <span className="text-primary text-xl sm:text-2xl font-bold ml-0.5">+</span>
            </div>
            <p className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-base-content/60">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsRow;
