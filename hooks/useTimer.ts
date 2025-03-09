"use client";

import { useCallback, useRef, useState } from "react";

export default function useTimer(
  initDelay: number = 2000,
  initCallback?: () => void,
  initState: "running" | "empty" = "empty",
) {
  const [delay, setDelay] = useState(initDelay);
  const [state, setState] = useState(initState);
  const [current, setCurrent] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);

  const timer = useRef<ReturnType<Window["setTimeout"]> | null>(null);
  const interval = useRef<ReturnType<Window["setInterval"]> | null>(null);

  const clickRef = useRef<HTMLButtonElement | null>(null);

  const createCallback = useCallback((newCallback?: () => void) => {
    return () => {
      if (newCallback) newCallback();
      if (clickRef.current) clickRef.current.click();
      setState("empty");
      setCurrent(null);
      setEnd(null);
    };
  }, []);

  const reset = useCallback(
    (newCallback?: () => void, delay: number = 0) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      if (interval.current) clearInterval(interval.current);
      interval.current = null;
      setCurrent(null);
      setEnd(null);
      setState("empty");

      if (newCallback) {
        timer.current = setTimeout(
          createCallback(newCallback),
          delay,
        ) as unknown as number;

        interval.current = setInterval(() => {
          setCurrent(Date.now());
        }, 50) as unknown as number;

        const now = Date.now();
        setEnd(now + delay);
        setDelay(delay);
        setState("running");
      }
    },
    [createCallback],
  );

  if (state === "running") {
    if (!timer.current) {
      reset(initCallback);
    }
  } else if (state === "empty") {
    if (timer.current) {
      reset();
    }
  }

  return { clickRef, current, end, reset, delay };
}
