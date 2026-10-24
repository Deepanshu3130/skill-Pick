import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * NumberedList Component.
 * Full-width rows separated by thin lines with mono number, big title, short description, and arrow.
 * On hover or focus: text shifts right 8px, arrow moves 4px, title brightens, description fades in on desktop.
 * Rows are real links.
 * 
 * @param {Object} props
 * @param {Array} props.items - [{ number, title, description, href, tags, count }]
 * @param {string} [props.eyebrow]
 * @param {string} [props.heading]
 * @param {string} [props.intro]
 * @param {string} [props.className]
 */
export function NumberedList({
  items = [],
  eyebrow = "",
  heading = "",
  intro = "",
  className = ""
}) {
  return (
    <section className={`py-16 md:py-24 border-b border-base-300 relative ${className}`}>
      <div className="w-11/12 max-w-5xl mx-auto px-4 text-left">
        
        {/* Header */}
        {(eyebrow || heading || intro) && (
          <div className="mb-10 sm:mb-14 space-y-2.5">
            {eyebrow && <span className="motion-eyebrow">{eyebrow}</span>}
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-base-content">
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

        {/* Rows List */}
        <div className="divide-y divide-base-300 border-y border-base-300">
          {items.map((item, index) => {
            const num = item.number || String(index + 1).padStart(2, '0');
            const href = item.href || `/courses/${item.slug || ''}`;

            return (
              <Link
                key={item.title || item.slug || index}
                to={href}
                className="group py-6 sm:py-8 px-2 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-base-200/40 focus:outline-hidden focus-visible:bg-base-200/50 focus-visible:ring-2 focus-visible:ring-primary/40 rounded-xl"
              >
                {/* Left: Mono Number & Title & Description */}
                <div className="flex items-start gap-4 sm:gap-6 min-w-0 transition-transform duration-200 ease-out group-hover:translate-x-2 group-focus-visible:translate-x-2">
                  <span className="motion-mono-num text-sm sm:text-base font-bold text-primary shrink-0 pt-0.5">
                    {num}
                  </span>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-base-content/90 group-hover:text-primary transition-colors truncate">
                        {item.title || item.name}
                      </h3>
                      {item.count && (
                        <span className="badge badge-sm badge-neutral font-mono text-[10px] shrink-0">
                          {item.count}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed max-w-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity duration-200 ease-out">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right: Pill Tags & Animated Arrow */}
                <div className="flex items-center gap-4 shrink-0 sm:self-center pl-10 sm:pl-0">
                  {item.tags && item.tags.length > 0 && (
                    <div className="hidden lg:flex items-center gap-1.5">
                      {item.tags.map((tag) => (
                        <span key={tag} className="motion-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="w-8 h-8 rounded-full bg-base-200 group-hover:bg-primary group-hover:text-primary-content flex items-center justify-center transition-colors">
                    <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default NumberedList;
