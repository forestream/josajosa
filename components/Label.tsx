import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

export default function Label({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"label">) {
  return (
    <label className={twMerge("cursor-pointer", className)} {...props}>
      {children}
    </label>
  );
}
