import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * HorizontalCarousel Component.
 * Native scroll-snap row (no hijacking), mouse drag, touch swipe, arrow keys,
 * prev/next buttons, thin progress bar under the row (scaleX), and edge fade mask.
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of item objects
 * @param {string} [props.eyebrow]
 * @param {string} [props.heading]
 * @param {string} [props.intro]
 * @param {Function} [props.renderItem] - Custom item renderer
 * @param {string} [props.className]
 */
export function HorizontalCarousel({
  items = [],
  eyebrow = "",
  heading = "",
  intro = "",
  renderItem,
  className = ""
}) {
  const scrollRef = useRef(null);
  const progressBarRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Mouse drag state
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const isDraggingRef = useRef(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);

    if (progressBarRef.current) {
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, el.scrollLeft / maxScroll)) : 0;
      progressBarRef.current.style.transform = `scaleX(${progress})`;
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState, items.length]);

  const scrollByAmount = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.clientWidth || 300;
    const scrollAmount = (cardWidth + 16) * 1.5 * direction;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollByAmount(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollByAmount(1);
    }
  };

  // Mouse drag handlers
  const onMouseDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    isDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const onMouseMove = (e) => {
    if (!isDownRef.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.4;
    if (Math.abs(walk) > 4) {
      isDraggingRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const onMouseUpOrLeave = () => {
    isDownRef.current = false;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);
  };

  const handleCardClick = (e) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className={`py-16 md:py-20 border-b border-base-300 relative ${className}`}>
      <div className="w-11/12 max-w-7xl mx-auto px-4">
        
        {/* Header with Title and Prev/Next buttons */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-left">
          <div className="space-y-2">
            {eyebrow && <span className="motion-eyebrow">{eyebrow}</span>}
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-base-content">
                {heading}
              </h2>
            )}
            {intro && (
              <p className="text-sm sm:text-base text-base-content/70 max-w-xl">
                {intro}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scrollByAmount(-1)}
              disabled={!canScrollLeft}
              aria-label="Previous items"
              className="btn btn-sm btn-circle btn-neutral border border-base-300 disabled:opacity-30 disabled:pointer-events-none hover:border-primary/50 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => scrollByAmount(1)}
              disabled={!canScrollRight}
              aria-label="Next items"
              className="btn btn-sm btn-circle btn-neutral border border-base-300 disabled:opacity-30 disabled:pointer-events-none hover:border-primary/50 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        {/* Carousel Row with Mask Fade */}
        <div className="relative -mx-4 px-4 overflow-hidden">
          <div
            ref={scrollRef}
            tabIndex={0}
            role="region"
            aria-label={heading || "Items carousel"}
            onKeyDown={handleKeyDown}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUpOrLeave}
            onMouseLeave={onMouseUpOrLeave}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-4 px-2 scroll-smooth no-scrollbar marquee-fade-edges cursor-grab active:cursor-grabbing focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {items.map((item, index) => (
              <div
                key={item.slug || item.id || index}
                onClickCapture={handleCardClick}
                className="snap-start shrink-0 w-[260px] sm:w-[300px] md:w-[320px]"
              >
                {renderItem ? (
                  renderItem(item, index)
                ) : (
                  <Link
                    to={item.href || `/courses/${item.slug || ''}`}
                    className="card bg-base-100 hover:bg-base-200/80 border border-base-300 p-6 rounded-2xl h-full flex flex-col justify-between transition-all duration-200 hover:border-primary/50 group text-left shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="motion-mono-num font-bold text-primary">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        {item.count && (
                          <span className="badge badge-sm badge-neutral font-mono text-[10px]">
                            {item.count}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-base-content group-hover:text-primary transition-colors mb-1.5 leading-snug">
                        {item.name || item.title}
                      </h3>

                      <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                        {item.description || `Explore structured courses, repositories, and study rooms for ${item.name || item.title}.`}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-base-300/80 flex items-center justify-between text-xs font-semibold text-primary">
                      <span>Explore topic</span>
                      <ChevronRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Thin Progress Bar Under Row (scaleX) */}
        <div className="mt-6 w-full max-w-xs mx-auto h-[2px] bg-base-300/60 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            aria-hidden="true"
            className="h-full bg-primary origin-left transition-transform duration-75 will-change-transform rounded-full"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

      </div>
    </section>
  );
}

export default HorizontalCarousel;
