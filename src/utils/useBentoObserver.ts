import { useEffect, useRef, useState, useCallback } from "react";

export interface BentoVisibilityState {
  [key: string]: boolean;
}

/**
 * Custom hook using Intersection Observer API to provide a smooth,
 * staggered fade-in transition for the Bento Grid section.
 */
export function useBentoObserver() {
  const [visibleItems, setVisibleItems] = useState<BentoVisibilityState>({});
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const registerItem = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
      // If observer already exists and item is newly mounted, observe it
      if (observerRef.current) {
        observerRef.current.observe(el);
      }
    } else {
      const existing = itemRefs.current.get(id);
      if (existing && observerRef.current) {
        observerRef.current.unobserve(existing);
      }
      itemRefs.current.delete(id);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback for environments without IntersectionObserver
      setVisibleItems({
        header: true,
        "01": true,
        "02": true,
        "03": true,
        "04": true,
        banner: true,
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-bento-id");
            if (id) {
              setVisibleItems((prev) => {
                if (prev[id]) return prev;
                return { ...prev, [id]: true };
              });
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observerRef.current = observer;

    // Observe all currently registered elements
    itemRefs.current.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  const isItemVisible = useCallback(
    (id: string) => Boolean(visibleItems[id]),
    [visibleItems]
  );

  return {
    registerItem,
    visibleItems,
    isItemVisible,
  };
}
