"use client";

import useSwipe from "@/hooks/useSwipe";
import { ComponentPropsWithoutRef, RefObject } from "react";

type SwiperProps = {
  contentKey: number | string;
};

function Content({ children, ...props }: ComponentPropsWithoutRef<"div">) {
  const { ref } = useSwipe();

  return (
    <div ref={ref as RefObject<HTMLDivElement>} {...props}>
      {children}
    </div>
  );
}

export default function Swiper({
  contentKey,
  children,
  ...props
}: ComponentPropsWithoutRef<"div"> & SwiperProps) {
  return (
    <div className="relative">
      <Content key={contentKey} {...props}>
        {children}
      </Content>
    </div>
  );
}
