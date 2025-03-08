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
};

export default function Plop({ render }: PlopProps) {
  const [transitions, setTransitions] = useState<(() => void)[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const renderRef = useRef<HTMLElement | null>(null);

  const handleClick: MouseEventHandler<HTMLDivElement> = () => {
    const clone = renderRef.current?.cloneNode() as HTMLDivElement;
    containerRef.current?.appendChild(clone);

    setTransitions((transitions) => [
      ...transitions,
      () => {
        clone.classList.remove("transition-transform", "hover:scale-[0.99]");
        clone.classList.add(
          "absolute",
          "top-0",
          "left-0",
          "origin-center",
          "transition-all",
          "duration-500",
          "opacity-100",
        );
        setTimeout(() => {
          clone.classList.add("scale-150", "opacity-0");
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
