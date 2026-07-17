"use client";

import { type CSSProperties, type HTMLAttributes, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./reveal.module.css";

export type RevealState = "idle" | "pending" | "revealed";
export type RevealVariant = "fade" | "up" | "scale";

export type UseRevealOptions = {
  disabled?: boolean;
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
};

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Tracks when an element enters the viewport without hiding its server-rendered
 * markup. If JavaScript or IntersectionObserver is unavailable, content remains
 * visible.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>({
  disabled = false,
  once = true,
  rootMargin = "0px 0px -10% 0px",
  threshold = 0.12,
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null);
  const hasRevealed = useRef(false);
  const [state, setState] = useState<RevealState>("idle");

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element || disabled || typeof IntersectionObserver === "undefined") {
      hasRevealed.current = true;
      setState("revealed");
      return;
    }

    if (once && hasRevealed.current) {
      setState("revealed");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      hasRevealed.current = true;
      setState("revealed");
      return;
    }

    setState("pending");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting) {
          hasRevealed.current = true;
          setState("revealed");

          if (once) observer.unobserve(entry.target);
          return;
        }

        if (!once) setState("pending");
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [disabled, once, rootMargin, threshold]);

  return {
    ref,
    state,
    isRevealed: state === "revealed",
  };
}

type RevealCssProperties = CSSProperties & {
  "--reveal-delay": string;
  "--reveal-distance": string;
  "--reveal-duration": string;
};

export type RevealProps = HTMLAttributes<HTMLDivElement> &
  UseRevealOptions & {
    delay?: number;
    distance?: number;
    duration?: number;
    index?: number;
    stagger?: number;
    variant?: RevealVariant;
  };

/**
 * Reveals its content once it enters the viewport. For staggered collections,
 * pass each item's zero-based index along with the desired stagger interval.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  disabled = false,
  distance = 20,
  duration = 560,
  index = 0,
  once = true,
  rootMargin,
  stagger = 0,
  style,
  threshold,
  variant = "up",
  ...props
}: RevealProps) {
  const { ref, state } = useReveal<HTMLDivElement>({ disabled, once, rootMargin, threshold });
  const effectiveDelay = Math.max(0, delay + Math.max(0, index) * Math.max(0, stagger));
  const revealStyle: RevealCssProperties = {
    ...style,
    "--reveal-delay": `${effectiveDelay}ms`,
    "--reveal-distance": `${Math.max(0, distance)}px`,
    "--reveal-duration": `${Math.max(0, duration)}ms`,
  };

  return (
    <div
      {...props}
      ref={ref}
      className={`${styles.root} ${className}`.trim()}
      data-reveal-state={state}
      data-reveal-variant={variant}
      style={revealStyle}
    >
      {children}
    </div>
  );
}
