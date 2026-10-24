import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Marquee component.
 * Features:
 * - Seamless infinite loop using CSS transform (translateX 0 -> -50% or -50% -> 0)
 * - CSS mask-image linear-gradient for 8% edge fades in light & dark themes
 * - Pauses on hover and focus-within
 * - Duplicate list is aria-hidden with tabIndex={-1}
 * - prefers-reduced-motion: static wrapped row
 *
 * @param {Object} props
 * @param {string} [props.label] - Eyebrow label displayed above marquee.
 * @param {Array<{text: string, href?: string}>} props.items - List of items to display.
 * @param {number} [props.speed=50] - Loop duration in seconds.
 * @param {'left'|'right'} [props.direction='left'] - Marquee direction.
 * @param {boolean} [props.pauseOnHover=true] - Whether to pause on hover/focus.
 * @param {string} [props.className] - Additional wrapper classNames.
 */
export function Marquee({
  label,
  items = [],
  speed = 50,
  direction = "left",
  pauseOnHover = true,
  className = ""
}) {
  if (!items || items.length === 0) return null;

  const animationClass = direction === "right" ? "animate-marquee-right" : "animate-marquee-left";

  return (
    <section className={`w-full overflow-hidden ${className}`}>
      {/* Eyebrow Label Above */}
      {label && (
        <div className="w-11/12 max-w-7xl mx-auto px-4 mb-3 text-left">
          <span className="motion-eyebrow">{label}</span>
        </div>
      )}

      {/* Top Thin 1px Divider */}
      <div className="motion-divider" />

      {/* Marquee Track Container with CSS Mask Fade */}
      <div 
        className={`marquee-container relative w-full py-8 overflow-hidden marquee-fade-edges ${
          pauseOnHover ? 'group' : ''
        }`}
      >
        <div 
          className={animationClass}
          style={{ '--marquee-speed': `${speed}s` }}
        >
          {/* List 1 (Accessible to screen readers) */}
          <div className="flex items-center gap-16 sm:gap-24 shrink-0 pr-16 sm:pr-24">
            {items.map((item, index) => {
              const content = (
                <span className="text-sm sm:text-base font-mono font-medium tracking-tight text-base-content/60 hover:text-base-content transition-colors select-none">
                  {item.text}
                </span>
              );

              return item.href ? (
                <Link
                  key={`item-${index}`}
                  to={item.href}
                  className="focus:outline-hidden focus:text-primary transition-colors shrink-0"
                >
                  {content}
                </Link>
              ) : (
                <span key={`item-${index}`} className="shrink-0">
                  {content}
                </span>
              );
            })}
          </div>

          {/* List 2 (Duplicate for infinite seamless loop: aria-hidden & non-focusable) */}
          <div 
            className="flex items-center gap-16 sm:gap-24 shrink-0 pr-16 sm:pr-24"
            aria-hidden="true"
            tabIndex={-1}
          >
            {items.map((item, index) => {
              const content = (
                <span className="text-sm sm:text-base font-mono font-medium tracking-tight text-base-content/60 hover:text-base-content transition-colors select-none">
                  {item.text}
                </span>
              );

              return item.href ? (
                <Link
                  key={`dup-${index}`}
                  to={item.href}
                  tabIndex={-1}
                  className="focus:outline-hidden focus:text-primary transition-colors shrink-0"
                >
                  {content}
                </Link>
              ) : (
                <span key={`dup-${index}`} className="shrink-0">
                  {content}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Thin 1px Divider */}
      <div className="motion-divider" />
    </section>
  );
}

export default Marquee;
