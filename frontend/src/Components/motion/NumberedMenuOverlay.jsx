import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * NumberedMenuOverlay Component (Mobile Only).
 * Full-screen overlay with large numbered links (01, 02, ...).
 * Staggered fade-up (40ms), Escape closes, focus trapped, body scroll locked.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Array} props.links - [{ label, to, number, onClick }]
 */
export function NumberedMenuOverlay({
  isOpen,
  onClose,
  links = []
}) {
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Lock body scroll and trap focus when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button on open
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const focusableElements = overlay.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select'
        );
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl?.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className="fixed inset-0 z-[100] bg-base-100 flex flex-col justify-between p-6 sm:p-8 md:hidden text-left"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-base-300 pb-4">
        <span className="motion-eyebrow">
          NAVIGATION
        </span>
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close menu"
          className="btn btn-sm btn-circle btn-ghost text-base-content/75 hover:text-base-content"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Numbered Nav Links */}
      <nav className="my-auto py-8">
        <ul className="space-y-6">
          {links.map((link, index) => {
            const num = link.number || String(index + 1).padStart(2, '0');

            return (
              <li
                key={link.to || link.label}
                className="transform transition-all duration-300 ease-out"
                style={{
                  transitionDelay: `${index * 40}ms`
                }}
              >
                <Link
                  to={link.to}
                  onClick={() => {
                    if (link.onClick) link.onClick();
                    onClose();
                  }}
                  className="group flex items-baseline gap-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content hover:text-primary transition-colors focus:outline-hidden focus-visible:text-primary"
                >
                  <span className="font-mono text-xs sm:text-sm font-bold text-primary/70 group-hover:text-primary transition-colors">
                    {num}
                  </span>
                  <span>{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Footer Info */}
      <div className="pt-4 border-t border-base-300 text-xs text-base-content/60 font-mono">
        SkillPick // Open Learning Stack
      </div>
    </div>
  );
}

export default NumberedMenuOverlay;
