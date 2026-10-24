import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ButtonArrow Component.
 * Primary CTA micro-interaction: arrow icon slides 4px right on hover, press scales 0.98.
 * Applied strictly to primary CTAs.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button label text
 * @param {string} [props.to] - React Router path
 * @param {string} [props.href] - External link URL
 * @param {Function} [props.onClick]
 * @param {string} [props.className]
 * @param {string} [props.size='sm'] - 'xs' | 'sm' | 'md' | 'lg'
 */
export function ButtonArrow({
  children,
  to,
  href,
  onClick,
  className = "",
  size = "sm",
  ...rest
}) {
  const baseClasses = `group inline-flex items-center justify-center gap-1.5 font-semibold btn btn-primary btn-${size} transition-all duration-150 active:scale-[0.98] rounded-xl ${className}`;

  const content = (
    <>
      <span>{children}</span>
      <ArrowRight className="size-3.5 transition-transform duration-200 ease-out group-hover:translate-x-1 shrink-0" />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={baseClasses} {...rest}>
      {content}
    </button>
  );
}

export default ButtonArrow;
