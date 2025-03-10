"use client";

import useSwipe, { Side } from "@/hooks/useSwipe";
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

type Flow = "up" | "down" | "right" | "left";

type SwiperProps = {
  render?: () => JSX.Element;
  contentKey: string;
  flow?: Flow;
};

const flowSide: Record<Flow, { current: Side; prev: Side }> = {
  up: { current: "bottom", prev: "top" },
  down: { current: "top", prev: "bottom" },
  right: { current: "left", prev: "right" },
  left: { current: "right", prev: "left" },
};

export default function Swiper({
  flow = "up",
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
    initialize: prevInitialize,
  } = useSwipe();

  const prevChildren = useRef<ReactNode | null>(null);
  useEffect(() => {
    setTimeout(() => {
      prevChildren.current = children;
    }, 500);
  }, [children]);

  useLayoutEffect(() => {
    currentSwipe("out", flowSide[flow].current);

    return () => {
      currentRemoveTransition();
    };
  }, [contentKey, currentRef, currentRemoveTransition, currentSwipe, flow]);

  useEffect(() => {
    setTimeout(() => {
      currentAddTransition();
      currentSwipe("in", flowSide[flow].current);
    }, 0);
  }, [contentKey, currentAddTransition, currentRef, currentSwipe, flow]);

  useLayoutEffect(() => {
    prevInitialize();
    prevSwipe("in", flowSide[flow].prev);
    prevRemoveTransition();
  }, [contentKey, flow, prevInitialize, prevRemoveTransition, prevSwipe]);

  useEffect(() => {
    setTimeout(() => {
      prevAddTransition();
      prevSwipe("out", flowSide[flow].prev);
    }, 0);
  }, [contentKey, flow, prevAddTransition, prevRef, prevSwipe]);

  return (
    <div className={twMerge("relative overflow-hidden", className)} {...props}>
      {prevChildren.current && (
        <div
          className="absolute top-4 right-0 bottom-0 left-0"
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
