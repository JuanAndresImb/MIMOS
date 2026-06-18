"use client";

/**
 * Reveal — scroll-triggered fade + slide-up animation
 * Wraps any element; animates in once when it enters the viewport.
 * Uses IntersectionObserver; degrades gracefully (pre-visible items show immediately).
 *
 * MOTION_INTENSITY 4 — 0.65s cubic-bezier(0.22,1,0.36,1) ease
 */

import React, { useRef, useEffect, useState, type ReactNode, type CSSProperties } from "react";

interface RevealProps {
  children: ReactNode;
  /** Extra delay in ms before the animation plays (for staggering sibling elements) */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Distance to slide from (default 32px) */
  distance?: number;
  /** IntersectionObserver threshold (default 0.12) */
  threshold?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

export default function Reveal({
  children,
  delay = 0,
  className,
  style,
  distance = 32,
  threshold = 0.12,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already in view at mount (e.g. fast scroll or small screen)
    if (el.getBoundingClientRect().top < window.innerHeight * 0.97) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${distance}px)`,
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
