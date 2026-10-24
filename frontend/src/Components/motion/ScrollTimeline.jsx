import React, { useRef, useState, useEffect } from 'react';
import useScrollProgress from './useScrollProgress';
import useInView from './useInView';

/**
 * Single Step item inside ScrollTimeline.
 */
function TimelineStep({
  step,
  stepIndex,
  totalSteps,
  activeStepIndex,
  progressValue,
  reducedMotion
}) {
  const [stepRef, isInView] = useInView({ threshold: 0.2, once: true });

  // Calculate if progress has passed this step
  const stepThreshold = totalSteps > 1 ? stepIndex / (totalSteps - 1) : 0;
  const isPast = reducedMotion || progressValue >= stepThreshold - 0.05;
  const isFocused = reducedMotion || activeStepIndex === stepIndex;

  return (
    <li
      ref={stepRef}
      data-step-index={stepIndex}
      className={`relative transition-opacity duration-250 text-left ${
        isFocused ? 'opacity-100' : 'opacity-60'
      }`}
    >
      {/* Step dot on the vertical line (aria-hidden) */}
      <span
        aria-hidden="true"
        className={`absolute -left-[35px] md:-left-[51px] top-2 -translate-x-1/2 w-3 h-3 rounded-full border-2 transition-all duration-200 z-10 ${
          isPast
            ? 'bg-primary border-primary scale-125'
            : 'bg-base-100 border-base-300'
        }`}
      />

      {/* Step Content: Fades up once on first view */}
      <div
        className={`transition-all duration-500 transform ${
          reducedMotion || isInView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
        style={{
          transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
        }}
      >
        {/* Mono Number & Label */}
        <div className="flex items-center gap-3 mb-1.5">
          <span className="motion-mono-num">{step.number}</span>
          <span className="font-mono text-xs uppercase tracking-wider text-base-content/50 font-semibold">
            {step.label}
          </span>
        </div>

        {/* Big Title */}
        <h3 className="text-xl sm:text-2xl md:text-[2rem] font-bold text-base-content tracking-tight leading-tight mb-2">
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed max-w-xl mb-4">
          {step.description}
        </p>

        {/* Outlined Pill Tags (staggered in 60ms apart) */}
        {step.tags && step.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {step.tags.map((tag, tagIndex) => (
              <span
                key={tag}
                className={`motion-pill transition-all duration-300 ${
                  reducedMotion || isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
                style={{
                  transitionDelay: reducedMotion ? '0ms' : `${tagIndex * 60}ms`
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * ScrollTimeline Component.
 * Desktop: Sticky 40/60 two-column layout.
 * Right: Smooth scroll-driven vertical progress line with riding dot.
 * Mobile: Single column, left line, indented steps.
 * Reduced motion: all dots active, line filled, fully visible.
 */
export function ScrollTimeline({
  eyebrow = "HOW IT WORKS",
  heading = "From search to unblocked in minutes.",
  intro = "A straightforward path from searching a skill to solving errors with peers in real-time rooms.",
  steps = [],
  className = ""
}) {
  const containerRef = useRef(null);
  useScrollProgress(containerRef, { startOffset: 0.15, endOffset: 0.85 });

  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [progressVal, setProgressVal] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(isReduced);

    if (isReduced) {
      setProgressVal(1);
      return;
    }

    let rafId = null;

    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const node = containerRef.current;
        if (!node) return;

        // Read CSS variable set by useScrollProgress
        const pStr = node.style.getPropertyValue('--progress') || '0';
        const p = parseFloat(pStr) || 0;
        setProgressVal(p);

        // Find step closest to viewport center
        const stepElements = node.querySelectorAll('[data-step-index]');
        const viewportCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let minDiff = Infinity;

        stepElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const diff = Math.abs(elementCenter - viewportCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = parseInt(el.getAttribute('data-step-index'), 10) || 0;
          }
        });

        setActiveStepIndex(closestIndex);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className={`py-20 md:py-28 border-b border-base-300 relative ${className}`}
    >
      <div className="w-11/12 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
          
          {/* Left Column: Sticky on Desktop (Screen fixed while right section scrolls) */}
          <div className="md:col-span-5 text-left md:sticky md:top-32 self-start space-y-4">
            <span className="motion-eyebrow text-primary">{eyebrow}</span>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-base-content leading-[1.08]">
              {heading}
            </h2>

            <p className="text-sm sm:text-base text-base-content/70 max-w-[36ch] leading-relaxed">
              {intro}
            </p>
          </div>

          {/* Right Column: Scroll-Driven Interactive Timeline */}
          <div className="md:col-span-7 relative pl-8 md:pl-12 text-left">
            
            {/* Dedicated Line Container: point rides exact edge and collapses at bounds */}
            <div
              aria-hidden="true"
              className="absolute left-2.5 md:left-3 top-2 bottom-8 w-[2px]"
            >
              {/* Background Muted Track */}
              <div className="w-full h-full bg-base-300/60 rounded-full" />

              {/* Progress Fill Line */}
              <div
                className="absolute top-0 left-0 w-full bg-primary origin-top rounded-full transition-[height] duration-75 ease-out"
                style={{
                  height: `${(reducedMotion ? 1 : progressVal) * 100}%`
                }}
              />

              {/* Moving Point riding leading edge - collapses when outside or at bounds */}
              {!reducedMotion && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary bg-base-100 flex items-center justify-center z-20 pointer-events-none transition-all duration-150 ${
                    progressVal <= 0.02 || progressVal >= 0.98 ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
                  }`}
                  style={{
                    top: `${Math.min(100, Math.max(0, progressVal * 100))}%`
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              )}
            </div>

            {/* Steps Ordered List (Semantic ol/li) */}
            <ol className="space-y-24 md:space-y-32">
              {steps.map((step, idx) => (
                <TimelineStep
                  key={step.number || idx}
                  step={step}
                  stepIndex={idx}
                  totalSteps={steps.length}
                  activeStepIndex={activeStepIndex}
                  progressValue={progressVal}
                  reducedMotion={reducedMotion}
                />
              ))}
            </ol>

          </div>

        </div>
      </div>
    </section>
  );
}

export default ScrollTimeline;
