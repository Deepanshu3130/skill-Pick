import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * CustomCursor Component.
 * - 6px filled dot that tracks mouse exactly
 * - 32px 1px border ring that tracks with 0.15 lerp lag
 * - Zero React re-renders during mousemove (managed purely via RAF & element refs)
 * - DaisyUI theme tokens (bg-primary, border-primary) for light & dark support
 * - Only enabled on mouse devices: (hover: hover) and (pointer: fine)
 * - Only rendered on Home ("/"), About ("/aboutUs"), and Explore ("/explore")
 * - Bypasses lag and scale animation under prefers-reduced-motion
 * - Auto-hides over text inputs, textareas, iframes, and videos
 * - Keeps system cursor visible at all times
 */
export function CustomCursor() {
  const location = useLocation();
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Position and interaction state stored in refs to avoid React re-renders
  const mouseX = useRef(-100);
  const mouseY = useRef(-100);
  const ringX = useRef(-100);
  const ringY = useRef(-100);

  const isVisible = useRef(false);
  const isMouseDown = useRef(false);
  const isInteractive = useRef(false);
  const isExcluded = useRef(false);

  // Check if current page is in the allowed whitelist
  const allowedRoutes = ['/', '/aboutUs', '/explore'];
  const isAllowedPage = allowedRoutes.includes(location.pathname);

  // Device capability check (mouse only)
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setHasMouse(mediaQuery.matches);

    const handleMediaChange = (e) => setHasMouse(e.matches);
    mediaQuery.addEventListener?.('change', handleMediaChange);
    return () => mediaQuery.removeEventListener?.('change', handleMediaChange);
  }, []);

  useEffect(() => {
    if (!hasMouse || !isAllowedPage) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationFrameId;

    // Helper to test if element is interactive (links, buttons, cards)
    const checkInteractive = (target) => {
      if (!target || !(target instanceof Element)) return false;
      return !!target.closest('a, button, [role="button"], [role="link"], .card, [data-interactive="true"]');
    };

    // Helper to test if element is an input, textarea, iframe, or video
    const checkExcluded = (target) => {
      if (!target || !(target instanceof Element)) return false;
      return !!target.closest('input, textarea, select, iframe, video, embed, object, [contenteditable="true"]');
    };

    const onMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      isVisible.current = true;

      // On first move, snap ring to mouse position immediately
      if (ringX.current === -100) {
        ringX.current = e.clientX;
        ringY.current = e.clientY;
      }

      isInteractive.current = checkInteractive(e.target);
      isExcluded.current = checkExcluded(e.target);
    };

    const onMouseDown = () => {
      isMouseDown.current = true;
    };

    const onMouseUp = () => {
      isMouseDown.current = false;
    };

    const onMouseLeave = () => {
      isVisible.current = false;
    };

    const onMouseEnter = () => {
      isVisible.current = true;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, { passive: true });

    // Single requestAnimationFrame loop
    const animate = () => {
      if (dotRef.current && ringRef.current) {
        // Calculate lerp lag for ring
        if (reducedMotion) {
          ringX.current = mouseX.current;
          ringY.current = mouseY.current;
        } else {
          ringX.current += (mouseX.current - ringX.current) * 0.15;
          ringY.current += (mouseY.current - ringY.current) * 0.15;
        }

        // Calculate scales
        let ringScale = 1;
        let dotScale = 1;

        if (!reducedMotion) {
          if (isMouseDown.current) {
            ringScale = 0.85;
            dotScale = 0.8;
          } else if (isInteractive.current) {
            ringScale = 1.6;
            dotScale = 0.5;
          }
        }

        // Visibility & Opacity
        const show = isVisible.current && !isExcluded.current;
        const opacity = show ? '1' : '0';

        // Apply hardware-accelerated transforms
        dotRef.current.style.transform = `translate3d(${mouseX.current - 3}px, ${mouseY.current - 3}px, 0) scale(${dotScale})`;
        dotRef.current.style.opacity = opacity;

        ringRef.current.style.transform = `translate3d(${ringX.current - 16}px, ${ringY.current - 16}px, 0) scale(${ringScale})`;
        ringRef.current.style.opacity = opacity;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [hasMouse, isAllowedPage]);

  // Don't render on touch screens or outside Home, About, Explore
  if (!hasMouse || !isAllowedPage) return null;

  return (
    <div className="pointer-events-none select-none" aria-hidden="true">
      {/* 6px Exact Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-primary pointer-events-none z-[9999] transition-opacity duration-200"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      />

      {/* 32px Lagging Smooth Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/50 pointer-events-none z-[9998] transition-opacity duration-200"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      />
    </div>
  );
}

export default CustomCursor;
