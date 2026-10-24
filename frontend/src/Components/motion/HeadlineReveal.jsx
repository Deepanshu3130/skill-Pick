import React, { useState, useEffect } from 'react';
import useInView from './useInView';

/**
 * HeadlineReveal Component.
 * Splits lines into overflow-hidden masks and slides each up from translateY(100%) to 0.
 * Staggered 60ms apart using transform & opacity only.
 * 
 * @param {Object} props
 * @param {string[]} props.lines - Array of headline line strings.
 * @param {string} [props.className] - Class applied to the heading container.
 * @param {string} [props.as='h1'] - HTML heading tag.
 */
export function HeadlineReveal({
  lines = [],
  className = "",
  as: Component = "h1"
}) {
  const [ref, isVisible] = useInView({ threshold: 0.1, once: true });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return (
    <Component ref={ref} className={className}>
      {lines.map((line, index) => (
        <span key={index} className="headline-mask-line block overflow-hidden">
          <span
            className={`headline-slide-up block ${reducedMotion || isVisible ? 'is-visible' : ''}`}
            style={{
              transitionDelay: reducedMotion ? '0ms' : `${index * 60}ms`
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Component>
  );
}

export default HeadlineReveal;
