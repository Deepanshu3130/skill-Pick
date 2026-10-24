import React, { useRef, useState, useEffect } from 'react';

/**
 * SpotlightCard Component.
 * Card with a 1px border that brightens toward the cursor via CSS variables --x/--y.
 * Throttled by rAF. 2px lift on hover.
 * No effect on touch. Very subtle: no glow, no gradient fill.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {Function} [props.onClick]
 * @param {string} [props.as='div']
 */
export function SpotlightCard({
  children,
  className = "",
  onClick,
  as: Component = "div",
  ...rest
}) {
  const cardRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    // Check if device is primarily touch
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouch(true);
    }
  }, []);

  const handlePointerMove = (e) => {
    if (isTouch || e.pointerType === 'touch') return;
    const card = cardRef.current;
    if (!card) return;

    if (rafRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
      setOpacity(1);
      rafRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setOpacity(0);
  };

  return (
    <Component
      ref={cardRef}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative rounded-2xl bg-base-100 border border-base-300 p-6 sm:p-7 transition-transform duration-200 ease-out hover:-translate-y-[2px] ${className}`}
      style={{
        '--x': '-999px',
        '--y': '-999px'
      }}
      {...rest}
    >
      {/* 1px Border illumination overlay - no background fill, border only */}
      {!isTouch && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[1px] rounded-2xl transition-opacity duration-200"
          style={{
            opacity: opacity,
            background: `radial-gradient(160px circle at var(--x) var(--y), var(--color-primary), transparent 100%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px'
          }}
        />
      )}

      {/* Card Content (Zero gradient fill) */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </Component>
  );
}

export default SpotlightCard;
