"use client";

import { useCallback, useRef } from "react";

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

  const swipe = useCallback(function swipe(
    directive: "in" | "out",
    side: "top" | "bottom" | "right" | "left",
  ) {
    if (!ref.current) return;

    if (directive === "in") {
      ref.current.classList.remove(...variants[side]);
    }

    if (directive === "out") {
      ref.current.classList.add(...variants[side]);
    }
  }, []);

  return { ref, addTransition, removeTransition, swipe };
}
