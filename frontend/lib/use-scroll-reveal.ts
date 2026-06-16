"use client";
import { useEffect, useRef } from "react";

interface ScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  stagger?: number; // ms delay between children
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { threshold = 0.15, rootMargin = "0px 0px -60px 0px", stagger = 0 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");

          // Stagger children if requested
          if (stagger > 0) {
            const children = el.querySelectorAll(".reveal-child");
            children.forEach((child, i) => {
              (child as HTMLElement).style.transitionDelay = `${i * stagger}ms`;
              child.classList.add("revealed");
            });
          }

          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, stagger]);

  return ref;
}
