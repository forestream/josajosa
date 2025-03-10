"use client";

import useSwipe from "@/hooks/useSwipe";
import {
  ComponentPropsWithoutRef,
  JSX,
  ReactNode,
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { twMerge } from "tailwind-merge";

type SwiperProps = {
  render?: () => JSX.Element;
  contentKey: string;
};

export default function Swiper({
  contentKey,
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div"> & SwiperProps) {
  const {
    ref: currentRef,
    swipe: currentSwipe,
    addTransition: currentAddTransition,
    removeTransition: currentRemoveTransition,
  } = useSwipe();
  const {
    ref: prevRef,
    swipe: prevSwipe,
    addTransition: prevAddTransition,
    removeTransition: prevRemoveTransition,
  } = useSwipe();

  const prevChildren = useRef<ReactNode | null>(null);
  useEffect(() => {
    setTimeout(() => {
      prevChildren.current = children;
    }, 500);
  }, [children]);

  useLayoutEffect(() => {
    currentSwipe("out", "bottom");

    return () => {
      currentRemoveTransition();
    };
  }, [contentKey, currentRef, currentRemoveTransition, currentSwipe]);

  useEffect(() => {
    setTimeout(() => {
      currentAddTransition();
      currentSwipe("in", "bottom");
    }, 0);
  }, [contentKey, currentAddTransition, currentRef, currentSwipe]);

  useLayoutEffect(() => {
    prevSwipe("in", "top");
    prevRemoveTransition();
  }, [contentKey, prevRemoveTransition, prevSwipe]);

  useEffect(() => {
    setTimeout(() => {
      prevAddTransition();
      prevSwipe("out", "top");
    }, 0);
  }, [contentKey, prevAddTransition, prevRef, prevSwipe]);

  return (
    <div className={twMerge("relative overflow-hidden", className)} {...props}>
      {prevChildren.current && (
        <div
          className="absolute top-2 left-0"
          ref={prevRef as RefObject<HTMLDivElement>}
        >
          {prevChildren.current}
        </div>
      )}
      <div className="" ref={currentRef as RefObject<HTMLDivElement>}>
        {children}
      </div>
    </div>
  );
}
