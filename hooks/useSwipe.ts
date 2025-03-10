"use client";

import { useCallback, useRef } from "react";

export type Directive = "in" | "out";
export type Side = "top" | "bottom" | "right" | "left";

const variants = {
  top: ["-translate-y-full", "opacity-0"],
  bottom: ["translate-y-full", "opacity-0"],
  right: ["translate-x-full", "opacity-0"],
  left: ["-translate-x-full", "opacity-0"],
};

export default function useSwipe() {
  const ref = useRef<HTMLElement | null>(null);

  const addTransition = useCallback(function addTransition() {
    if (!ref.current) return;

    ref.current.classList.add("transition-all", "duration-500");
  }, []);

  const removeTransition = useCallback(function removeTransition() {
    if (!ref.current) return;

    ref.current.classList.remove("transition-all", "duration-500");
  }, []);

  const swipe = useCallback(function swipe(directive: Directive, side: Side) {
    if (!ref.current) return;

    if (directive === "in") {
      ref.current.classList.remove(...variants[side]);
    }

    if (directive === "out") {
      ref.current.classList.add(...variants[side]);
    }
  }, []);

  const initialize = useCallback(function initialize() {
    if (!ref.current) return;

    ref.current.classList.forEach((className) => {
      if (className.includes("translate"))
        ref.current?.classList.remove(className);
      if (className.includes("opacity-0"))
        ref.current?.classList.remove(className);
    });
  }, []);

  return { ref, addTransition, removeTransition, swipe, initialize };
}
