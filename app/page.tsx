"use client";

import Card from "@/components/Card";
import Plop from "@/components/Plop";
import Swiper from "@/components/Swiper";
import { RefObject, useState } from "react";

export default function App() {
  const [questions] = useState<number[]>(() =>
    Array.from({ length: 4 }).map((_, i) => i),
  );

  const [question, setQuestion] = useState(0);

  const handleNext = () =>
    setQuestion(question + 1 >= questions.length ? 0 : question + 1);

  return (
    <main className="flex h-[100vh] items-center justify-center overflow-hidden">
      <Swiper contentKey={question}>
        <Plop
          render={(ref) => {
            return <Card ref={ref as RefObject<HTMLDivElement>} />;
          }}
        />
      </Swiper>
      <button className="cursor-pointer" onClick={handleNext}>
        next
      </button>
    </main>
  );
}
