"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

export default function useSwipe() {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;

    ref.current.classList.remove("-translate-y-full");

    ref.current.classList.add(
      "translate-y-full",
      "opacity-0",
      "transition-all",
      "duration-500",
    );
  }, []);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const parent = element.parentNode as HTMLElement;

    setTimeout(() => {
      element.classList.remove("translate-y-full", "opacity-0");
    }, 0);

    return () => {
      const clone = element.cloneNode(true) as HTMLElement;
      clone.classList.add("absolute", "top-0", "left-0");
      parent.appendChild(clone);

      setTimeout(() => {
        clone.classList.add("transition-all", "-translate-y-full", "opacity-0");
      }, 0);

      setTimeout(() => {
        clone.remove();
      }, 500);
    };
  }, []);

  return { ref };
}
