import { ComponentPropsWithRef } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = {
  variant?: "default" | "warning" | "secondary" | "ghost";
};

const variants = {
  default:
    "bg-grapefruit-300 border-grapefruit-500 hover:bg-grapefruit-400 border text-white transition-colors",
  warning: "border-red-700 bg-red-500 hover:bg-red-600 transition-colors",
  secondary:
    "border-grapefruit-500 hover:bg-grapefruit-100 text-grapefruit-700 border bg-white transition-colors",
  ghost:
    "hover:bg-[rgba(0,0,0,0.1)] text-grapefruit-700 bg-transparent transition-all",
};

const addCommonStyle = (variant: ButtonProps["variant"] = "default") => {
  return twMerge("px-4 py-2 rounded cursor-pointer", variants[variant]);
};

export default function Button({
  variant = "default",
  children,
  className,
  ...props
}: ComponentPropsWithRef<"button"> & ButtonProps) {
  return (
    <button className={twMerge(addCommonStyle(variant), className)} {...props}>
      {children}
      <div></div>
    </button>
  );
}
