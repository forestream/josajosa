import { ComponentPropsWithRef } from "react";
import Button from "./Button";

type TimerButtonProps = {
  current: number | null;
  end: number | null;
  delay: number;
};

export default function TimerButton({
  current,
  end,
  delay,
  children,
  ref,
  ...props
}: ComponentPropsWithRef<"button"> & TimerButtonProps) {
  return (
    <div className="relative inline-block">
      <Button ref={ref} {...props}>
        {children}
      </Button>
      <div
        className="absolute inset-0 origin-left bg-white opacity-50"
        style={
          current && end
            ? { transform: `scaleX(${1 - (end - current) / delay})` }
            : { transform: "scaleX(0)" }
        }
      ></div>
    </div>
  );
}
