"use client";

import Card from "@/components/Card";
import Plop from "@/components/Plop";
import Swiper from "@/components/Swiper";
import useGetDocs from "@/hooks/useGetDocs";
import { db } from "@/lib/firebase";
import { Question } from "@/utils/postSurvey";
import { collection, limit, query } from "firebase/firestore";
import { RefObject, useMemo, useState } from "react";

export default function App() {
  const surveyQuery = useMemo(
    () => query(collection(db, "surveys"), limit(1)),
    [],
  );
  const surveys = useGetDocs(surveyQuery);
  const surveyId = surveys[0]?.id;

  const questionsQuery = useMemo(
    () => (surveyId ? collection(db, "surveys", surveyId, "questions") : null),
    [surveyId],
  );
  const questions = useGetDocs(questionsQuery);
  const [index, setIndex] = useState(0);

  if (!questions.length) return null;

  const { question, options } = questions[index].data() as Question;
  const id = questions[index].id;

  const handleNext = () =>
    setIndex(index + 1 >= questions.length ? 0 : index + 1);

  return (
    <main className="flex h-[100vh] items-center justify-center overflow-hidden">
      <Swiper contentKey={id}>
        <Plop
          render={(ref) => {
            return (
              <Card
                ref={ref as RefObject<HTMLDivElement>}
                className="px-12 py-8"
              >
                <h2 className="mb-4 text-xl">{question}</h2>
                {options && options.map((option, i) => <p key={i}>{option}</p>)}
              </Card>
            );
          }}
        />
      </Swiper>
      <button className="cursor-pointer" onClick={handleNext}>
        next
      </button>
    </main>
  );
}
