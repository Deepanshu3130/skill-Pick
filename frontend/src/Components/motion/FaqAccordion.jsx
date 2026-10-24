import React, { useState } from 'react';
import { Plus } from 'lucide-react';

/**
 * FaqAccordion Component.
 * Rows with thin dividers and a plus icon that rotates 45 degrees.
 * Answer height animates via grid-template-rows (0fr to 1fr) without height calculation or layout shift.
 * Full button, aria-expanded, and aria-controls semantics.
 * 
 * @param {Object} props
 * @param {Array} props.items - Array of { question, answer }
 * @param {boolean} [props.allowMultiple=false]
 * @param {string} [props.eyebrow]
 * @param {string} [props.heading]
 * @param {string} [props.intro]
 * @param {string} [props.className]
 */
export function FaqAccordion({
  items = [],
  allowMultiple = false,
  eyebrow = "",
  heading = "",
  intro = "",
  className = ""
}) {
  const [openIndices, setOpenIndices] = useState([0]);

  const toggleItem = (index) => {
    setOpenIndices((prev) => {
      const isOpen = prev.includes(index);
      if (allowMultiple) {
        return isOpen ? prev.filter((i) => i !== index) : [...prev, index];
      }
      return isOpen ? [] : [index];
    });
  };

  return (
    <section className={`py-16 md:py-24 border-b border-base-300 relative ${className}`}>
      <div className="w-11/12 max-w-4xl mx-auto px-4 text-left">
        
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

        {/* Accordion Rows */}
        <div className="divide-y divide-base-300 border-y border-base-300">
          {items.map((item, index) => {
            const isOpen = openIndices.includes(index);
            const answerId = `faq-answer-${index}`;

            return (
              <div key={item.question || index} className="group">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  className="w-full py-5 sm:py-6 flex items-center justify-between gap-4 text-left font-bold text-base sm:text-lg text-base-content hover:text-primary transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
                >
                  <span className="pr-2">{item.question}</span>

                  <span
                    aria-hidden="true"
                    className="w-7 h-7 rounded-full bg-base-200 group-hover:bg-primary/10 flex items-center justify-center shrink-0 text-base-content/70 group-hover:text-primary transition-all duration-200"
                  >
                    <Plus
                      className={`size-4 transition-transform duration-250 ease-out ${
                        isOpen ? 'rotate-45 text-primary' : 'rotate-0'
                      }`}
                    />
                  </span>
                </button>

                {/* Animated Grid Height: 0fr to 1fr */}
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="grid transition-[grid-template-rows] duration-250 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="pb-6 text-xs sm:text-sm text-base-content/75 leading-relaxed space-y-2">
                      {typeof item.answer === 'string' ? (
                        <p>{item.answer}</p>
                      ) : (
                        item.answer
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FaqAccordion;
