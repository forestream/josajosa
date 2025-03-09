"use client";

import Card from "@/components/Card";
import Swiper from "@/components/Swiper";
import useGetDocs from "@/hooks/useGetDocs";
import { db } from "@/lib/firebase";
import postResponse, { Response } from "@/utils/postResponse";
import { Question } from "@/utils/postSurvey";
import { collection, limit, query } from "firebase/firestore";
import { FormEvent, useEffect, useMemo, useState } from "react";
import RadioInputs from "@/components/RadioInputs";
import CheckboxInputs from "@/components/CheckboxInputs";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import useTimer from "@/hooks/useTimer";
import TimerButton from "@/components/TimerButton";

export default function App() {
  const surveyQuery = useMemo(
    () => query(collection(db, "surveys"), limit(1)),
    [],
  );
  const surveys = useGetDocs(surveyQuery);
  const surveyId = surveys[0]?.id;
  const surveyTitle = surveys[0]?.get("title");

  const questionsQuery = useMemo(
    () => (surveyId ? collection(db, "surveys", surveyId, "questions") : null),
    [surveyId],
  );
  const questions = useGetDocs(questionsQuery);
  const [index, setIndex] = useState(0);

  const [responses, setResponses] = useState<Response[]>([]);

  const { clickRef, current, end, delay, reset } = useTimer(1400);

  useEffect(() => {
    if (!questions.length) return;

    setResponses(() =>
      questions.map((questionDoc) => {
        const { question, type } = questionDoc.data() as Question;

        return {
          questionId: questionDoc.id,
          question,
          type,
          response: type === "checkbox" ? [] : "",
        };
      }),
    );
  }, [questions]);

  if (!questions.length || !responses.length) return null;

  const { question, options, type } = questions[index].data() as Question;
  const questionId = questions[index].id;
  const { response } = responses[index];

  const handleIndex = (amount: number) =>
    setIndex(
      index + amount >= questions.length
        ? 0
        : index + amount < 0
          ? questions.length - 1
          : index + amount,
    );

  const handleAnswer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const keys = formData.keys().toArray();

    setResponses((responses) =>
      responses.map((response) => {
        if (!keys.includes(response.questionId)) return response;

        return {
          ...response,
          response:
            response.type === "checkbox"
              ? (formData.getAll(response.questionId) as string[])
              : (formData.get(response.questionId) as string),
        };
      }),
    );
  };

  const handleTimer = () => {
    reset(() => {}, 1400);
  };

  const handleSubmit = () => {
    console.log({ responses, surveyId, surveyTitle });
    postResponse({ responses, surveyId, surveyTitle });
  };

  return (
    <>
      <header className="h-[100px]"></header>
      <main className="mx-auto max-w-[800px]">
        <div className="mb-4">
          <p className="mr-20 text-right text-yellow-900">
            {index + 1} / {questions.length}
          </p>
        </div>
        <div className="flex items-center justify-center overflow-hidden">
          <form className="relative" onSubmit={handleAnswer}>
            <Swiper contentKey={questionId}>
              <Card className="mb-4 h-[600px] w-[450px] px-12 py-8 text-yellow-950">
                <h2 className="mb-4 text-xl">{question}</h2>
                {type === "radio" && (
                  <RadioInputs
                    onChange={handleTimer}
                    defaultValue={response as string}
                    options={options!}
                    name={questionId}
                    id={questionId}
                    className="mr-2"
                  />
                )}
                {type === "text" && (
                  <TextInput
                    onChange={handleTimer}
                    defaultValue={response}
                    name={questionId}
                    type="text"
                  />
                )}
                {type === "checkbox" && (
                  <CheckboxInputs
                    onChange={handleTimer}
                    defaultValue={response as string[]}
                    options={options!}
                    name={questionId}
                    id={questionId}
                    className="mr-2"
                  />
                )}
              </Card>
            </Swiper>
            <div className="flex justify-between">
              <div>
                <Button className="mr-2" onClick={() => handleIndex(-1)}>
                  이전
                </Button>
                <TimerButton
                  delay={delay}
                  ref={clickRef}
                  current={current}
                  end={end}
                  onClick={() => handleIndex(1)}
                >
                  다음
                </TimerButton>
              </div>
              <div>
                <Button onClick={handleSubmit}>제출</Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
