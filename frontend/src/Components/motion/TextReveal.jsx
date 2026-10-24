import React, { useRef, useState, useEffect } from 'react';
import useScrollProgress from './useScrollProgress';

/**
 * TextReveal Component.
 * A large statement whose words transition from 0.2 to full opacity as the user scrolls past.
 * Opacity only, driven by useScrollProgress without layout shift.
 * Reduced motion: Fully visible.
 * Use at most once per page.
 * 
 * @param {Object} props
 * @param {string} props.text - Mission or statement text
 * @param {string} [props.eyebrow]
 * @param {string} [props.className]
 */
export function TextReveal({
  text = "",
  eyebrow = "",
  className = ""
}) {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  const words = text.split(/\s+/).filter(Boolean);

  useScrollProgress(containerRef, { startOffset: 0.25, endOffset: 0.75 });

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(isReduced);

    if (isReduced) {
      wordsRef.current.forEach((el) => {
        if (el) el.style.opacity = '1';
      });
      return;
    }

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const progressStr = container.style.getPropertyValue('--progress') || '0';
        const progress = Math.min(1, Math.max(0, parseFloat(progressStr) || 0));

        const total = words.length;
        wordsRef.current.forEach((wordEl, idx) => {
          if (!wordEl) return;
          // Calculate when this specific word activates
          const start = idx / total;
          const end = (idx + 1) / total;
          
          let wordProgress = 0;
          if (progress >= end) {
            wordProgress = 1;
          } else if (progress <= start) {
            wordProgress = 0;
          } else {
            wordProgress = (progress - start) / (end - start);
          }

          // Transition opacity smoothly from 0.2 to 1.0
          const opacity = 0.2 + 0.8 * wordProgress;
          wordEl.style.opacity = opacity.toFixed(3);
        });

        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [words.length]);

  return (
    <section 
      ref={containerRef} 
      className={`py-20 md:py-32 border-b border-base-300 relative ${className}`}
    >
      <div className="w-11/12 max-w-4xl mx-auto px-4 text-left space-y-4">
        {eyebrow && <span className="motion-eyebrow">{eyebrow}</span>}

        <p className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-base-content leading-[1.18] flex flex-wrap gap-x-2.5 gap-y-1.5">
          {words.map((word, index) => (
            <span
              key={index}
              ref={(el) => { wordsRef.current[index] = el; }}
              className="inline-block transition-opacity duration-75 will-change-[opacity]"
              style={{
                opacity: reducedMotion ? 1 : 0.2
              }}
            >
              {word}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

export default TextReveal;
