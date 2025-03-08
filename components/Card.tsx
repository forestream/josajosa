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
        "h-[800px] w-[600px] cursor-pointer rounded bg-white shadow-lg transition-transform hover:scale-[0.99]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
