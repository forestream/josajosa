"use client";

import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export default function Card({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={twMerge(
        "h-[400px] w-[300px] cursor-pointer rounded bg-white shadow-lg transition-transform hover:scale-[0.99]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
