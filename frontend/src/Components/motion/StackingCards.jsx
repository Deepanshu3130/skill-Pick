import React, { useRef, useState, useEffect } from 'react';

/**
 * StackingCards Component.
 * Cards stick to the top with increasing top offsets (position: sticky).
 * The card underneath scales from 1 to 0.96 and dims to 0.7 as the next slides over it.
 * Mobile: Plain stacked cards.
 * Reduced motion: No scale or dimming.
 * Max 5 cards.
 * 
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {string} [props.heading]
 * @param {string} [props.intro]
 * @param {Array} props.items - [{ number, title, text, tags }]
 * @param {string} [props.className]
 */
export function StackingCards({
  eyebrow = "",
  heading = "",
  intro = "",
  items = [],
  className = ""
}) {
  const containerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [scales, setScales] = useState({});
  const [opacities, setOpacities] = useState({});

  // Enforce max 5 cards
  const displayItems = items.slice(0, 5);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(isReduced);

    if (isReduced) return;

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const isMobile = window.innerWidth < 768;
        if (isMobile) {
          setScales({});
          setOpacities({});
          rafId = null;
          return;
        }

        const cards = container.querySelectorAll('[data-stack-card]');
        const newScales = {};
        const newOpacities = {};

        cards.forEach((card, idx) => {
          if (idx === cards.length - 1) {
            newScales[idx] = 1;
            newOpacities[idx] = 1;
            return;
          }

          const nextCard = cards[idx + 1];
          if (!nextCard) return;

          const cardRect = card.getBoundingClientRect();
          const nextRect = nextCard.getBoundingClientRect();

          // Distance between current card top and next card top
          const overlapDistance = cardRect.top - nextRect.top;
          const overlapThreshold = cardRect.height || 300;

          if (nextRect.top <= cardRect.top + 40) {
            // Next card has reached or passed current card
            const progress = Math.min(1, Math.max(0, (cardRect.top + 40 - nextRect.top) / overlapThreshold));
            // Scale from 1 down to 0.96
            newScales[idx] = 1 - progress * 0.04;
            // Opacity from 1 down to 0.7
            newOpacities[idx] = 1 - progress * 0.3;
          } else {
            newScales[idx] = 1;
            newOpacities[idx] = 1;
          }
        });

        setScales(newScales);
        setOpacities(newOpacities);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [displayItems.length]);

  return (
    <section className={`py-16 md:py-24 border-b border-base-300 ${className}`}>
      <div className="w-11/12 max-w-4xl mx-auto px-4">
        
        {/* Section Header */}
        {(eyebrow || heading || intro) && (
          <div className="mb-12 md:mb-16 text-left space-y-3">
            {eyebrow && <span className="motion-eyebrow">{eyebrow}</span>}
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content leading-tight">
                {heading}
              </h2>
            )}
            {intro && (
              <p className="text-sm sm:text-base text-base-content/70 max-w-2xl leading-relaxed">
                {intro}
              </p>
            )}
          </div>
        )}

        {/* Stacking Cards Container */}
        <div ref={containerRef} className="relative space-y-6 md:space-y-0 pb-12">
          {displayItems.map((item, index) => {
            const scale = reducedMotion ? 1 : (scales[index] ?? 1);
            const opacity = reducedMotion ? 1 : (opacities[index] ?? 1);
            const topOffset = 100 + index * 24; // desktop increasing top offset

            return (
              <div
                key={item.title || index}
                data-stack-card
                className="md:sticky bg-base-100 border border-base-300 rounded-2xl p-6 sm:p-8 transition-[transform,opacity] duration-150 ease-out origin-top text-left shadow-xs"
                style={{
                  top: `calc(${topOffset}px)`,
                  transform: reducedMotion ? 'none' : `scale(${scale})`,
                  opacity: reducedMotion ? 1 : opacity,
                  zIndex: index + 1
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="motion-mono-num text-base font-bold text-primary">
                    {item.number || String(index + 1).padStart(2, '0')}
                  </span>
                  {item.badge && (
                    <span className="badge badge-sm badge-neutral font-mono text-[11px]">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-base-content tracking-tight mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-base-content/75 leading-relaxed mb-6">
                  {item.text || item.description}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-base-300/60">
                    {item.tags.map((tag) => (
                      <span key={tag} className="motion-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default StackingCards;
