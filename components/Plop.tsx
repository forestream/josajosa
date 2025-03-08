"use client";

import {
  MouseEventHandler,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

type PlopProps = {
  render: (ref: RefObject<HTMLElement | null>) => ReactNode;
  onClick?: () => void;
};

export default function Plop({ render, onClick }: PlopProps) {
  const [transitions, setTransitions] = useState<(() => void)[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderRef = useRef<HTMLElement | null>(null);

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const clone = renderRef.current?.cloneNode() as HTMLDivElement;
    containerRef.current?.appendChild(clone);

    if (!renderRef.current?.contains(e.target as HTMLElement) && onClick) {
      onClick();
    }

    setTransitions((transitions) => [
      ...transitions,
      () => {
        clone.classList.forEach((value) => {
          if (value.includes("transition")) clone.classList.remove(value);
        });

        clone.classList.remove("hover:scale-[0.99]");
        clone.classList.add(
          "absolute",
          "top-0",
          "left-0",
          "right-0",
          "bottom-0",
          "origin-center",
          "transition-all",
          "duration-500",
          "opacity-100",
        );
        setTimeout(() => {
          clone.classList.add("scale-125", "opacity-0");
          clone.classList.remove("opacity-100");
        }, 0);
        setTimeout(() => {
          clone.remove();
        }, 500);
      },
    ]);
  };

  useEffect(() => {
    if (!transitions.length) return;

    transitions[0]();

    setTransitions((transitions) => transitions.slice(1));
  }, [transitions]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-visible"
      onClick={handleClick}
    >
      {render(renderRef)}
    </div>
  );
}
