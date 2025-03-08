"use client";

import Card from "@/components/Card";
import Input from "@/components/TextInput";
import Swiper from "@/components/Swiper";
import useGetDocs from "@/hooks/useGetDocs";
import { db } from "@/lib/firebase";
import { Response } from "@/utils/postResponse";
import { Question } from "@/utils/postSurvey";
import { collection, limit, query } from "firebase/firestore";
import { FormEvent, useEffect, useMemo, useState } from "react";
import RadioInputs from "@/components/RadioInputs";
import CheckboxInputs from "@/components/CheckboxInputs";

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

  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    if (!questions.length) return;

    setResponses(() =>
      questions.map((questionDoc) => {
        const { question, type } = questionDoc.data() as Question;

        return {
          questionId: questionDoc.id,
          question,
          type,
          response: "",
        };
      }),
    );
  }, [questions]);

  if (!questions.length) return null;

  const { question, options, type } = questions[index].data() as Question;
  const questionId = questions[index].id;

  const handleNext = () =>
    setIndex(index + 1 >= questions.length ? 0 : index + 1);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
  };

  return (
    <main className="flex h-[100vh] items-center justify-center overflow-hidden">
      <form onSubmit={handleSubmit}>
        <Swiper contentKey={questionId}>
          <Card className="mb-4 h-[600px] w-[450px] px-12 py-8 text-yellow-950">
            <h2 className="mb-4 text-xl">{question}</h2>
            {type === "radio" && (
              <RadioInputs
                options={options!}
                name={questionId}
                id={questionId}
                className="mr-2"
              />
            )}
            {type === "text" && <Input type="text" />}
            {type === "checkbox" && (
              <CheckboxInputs
                options={options!}
                name={questionId}
                id={questionId}
                className="mr-2"
              />
            )}
          </Card>
        </Swiper>
        <button className="cursor-pointer" onClick={handleNext}>
          next
        </button>
      </form>
    </main>
  );
}
