import React, { useState, useEffect, useRef } from 'react';
import useInView from './useInView';

/**
 * Single block within the scrolling right column of StickyScrollSection.
 */
function ScrollBlock({
  block,
  index,
  total,
  onActivate,
  reducedMotion
}) {
  const [ref, isInView] = useInView({ threshold: 0.35, once: true });
  const blockRef = useRef(null);

  useEffect(() => {
    const el = blockRef.current;
    if (!el || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onActivate(index);
        }
      },
      {
        root: null,
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0.1
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onActivate, reducedMotion]);

  return (
    <div
      ref={(node) => {
        ref.current = node;
        blockRef.current = node;
      }}
      data-block-index={index}
      className="py-12 sm:py-16 border-b border-base-300/60 last:border-b-0 text-left"
    >
      <div
        className={`transition-all duration-500 ${
          reducedMotion || isInView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="motion-mono-num">
            {block.number || String(index + 1).padStart(2, '0')}
          </span>
          {block.label && (
            <span className="font-mono text-xs uppercase tracking-wider text-primary font-semibold">
              {block.label}
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-base-content tracking-tight leading-snug mb-3">
          {block.title}
        </h3>

        <div className="text-sm sm:text-base text-base-content/75 leading-relaxed space-y-3">
          {typeof block.content === 'string' ? (
            <p>{block.content}</p>
          ) : (
            block.content
          )}
        </div>

        {block.tags && block.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {block.tags.map((tag) => (
              <span key={tag} className="motion-pill">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * StickyScrollSection Component.
 * Left column sticky with heading, short text, and a mono step counter like "02 / 04".
 * Right column tall stacked content blocks that scroll past.
 * 
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {string} props.heading
 * @param {string} [props.intro]
 * @param {Array} props.blocks - [{ number, label, title, content, tags }]
 * @param {string} [props.className]
 */
export function StickyScrollSection({
  eyebrow = "",
  heading = "",
  intro = "",
  blocks = [],
  className = ""
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const total = blocks.length;
  const currentNum = String(activeIndex + 1).padStart(2, '0');
  const totalNum = String(total).padStart(2, '0');

  return (
    <section className={`py-16 md:py-24 border-b border-base-300 relative ${className}`}>
      <div className="w-11/12 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          
          {/* Left Column: Sticky on Desktop */}
          <div className="md:col-span-5 text-left">
            <div className="md:sticky md:top-28 space-y-4">
              {eyebrow && <span className="motion-eyebrow">{eyebrow}</span>}
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-base-content leading-[1.1]">
                {heading}
              </h2>

              {intro && (
                <p className="text-sm sm:text-base text-base-content/70 max-w-[38ch] leading-relaxed">
                  {intro}
                </p>
              )}

              {/* Monospace Step Indicator */}
              {total > 0 && (
                <div className="pt-2 flex items-center gap-2 font-mono text-sm">
                  <span className="text-primary font-bold text-base">{currentNum}</span>
                  <span className="text-base-content/40">/</span>
                  <span className="text-base-content/50">{totalNum}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stacked Scrolling Content Blocks */}
          <div className="md:col-span-7 divide-y divide-base-300/40">
            {blocks.map((block, idx) => (
              <ScrollBlock
                key={block.title || idx}
                block={block}
                index={idx}
                total={total}
                onActivate={setActiveIndex}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default StickyScrollSection;
