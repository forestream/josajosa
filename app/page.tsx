"use client";

import Card from "@/components/Card";
import Swiper from "@/components/Swiper";
import useGetDocs from "@/hooks/useGetDocs";
import { db } from "@/lib/firebase";
import postResponse, { Response } from "@/utils/postResponse";
import { Question } from "@/utils/postSurvey";
import {
  collection,
  limit,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import RadioInputs from "@/components/RadioInputs";
import CheckboxInputs from "@/components/CheckboxInputs";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import useTimer from "@/hooks/useTimer";
import TimerButton from "@/components/TimerButton";
import validateResponses from "@/utils/validateResponses";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const [flow, setFlow] = useState<"next" | "prev">("next");

  const [responses, setResponses] = useState<Response[]>([]);

  const { clickRef, current, end, delay, reset } = useTimer(1400);
  const {
    clickRef: validationClickRef,
    current: validationCurrent,
    end: validationEnd,
    delay: validationDelay,
    reset: validationReset,
  } = useTimer(1400);

  const handleTimer = useCallback(() => {
    reset(() => {}, 1400);
  }, [reset]);

  const initializeResponses = useCallback(
    (questions: QueryDocumentSnapshot[]) => {
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
    },
    [],
  );

  useEffect(() => {
    if (!questions.length) return;

    initializeResponses(questions);
  }, [initializeResponses, questions]);

  const [fixResponseOpen, setFixResponseOpen] = useState(false);

  if (!questions.length || !responses.length) return null;

  const { question, options, type } = questions[index].data() as Question;
  const questionId = questions[index].id;
  const { response } = responses[index];

  const handleIndex = (amount: number) => {
    if (amount < 0) setFlow("prev");
    else setFlow("next");

    setIndex(
      index + amount >= questions.length
        ? 0
        : index + amount < 0
          ? questions.length - 1
          : index + amount,
    );
  };

  const handleAnswer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleResponse = (
    e: ChangeEvent<HTMLInputElement>,
    responseIndex: number,
  ) => {
    setResponses((responses) =>
      responses.map((item, i) => {
        if (responseIndex !== i) return item;

        const { type, response } = item;

        const nextResponse =
          type === "checkbox"
            ? response.includes(e.target.value)
              ? (response as string[]).filter(
                  (value) => value !== e.target.value,
                )
              : (response as string[]).concat(e.target.value)
            : e.target.value;

        return {
          ...item,
          response: nextResponse,
        };
      }),
    );
  };

  const handleSubmit = async () => {
    if (validateResponses(responses)) {
      await postResponse({ responses, surveyId, surveyTitle });
      initializeResponses(questions);
    } else {
      setFixResponseOpen(true);
      validationReset(() => {
        setFixResponseOpen(false);
      }, 1800);
    }
  };

  const handleFixResponse = () => {
    setIndex(responses.findIndex((item) => item.response.length === 0));
  };

  return (
    <>
      <header className="h-[100px]"></header>
      <main className="mx-auto max-w-[800px]">
        <div className="shadow-pastel-yellow-400 relative z-10 shadow-[0_0_8px_8px]">
          <p className="mr-20 text-right text-yellow-900">
            {index + 1} / {questions.length}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <form className="relative" onSubmit={handleAnswer}>
            <Swiper
              flow={flow === "next" ? "left" : "right"}
              contentKey={questionId}
              className="py-4"
            >
              <Card className="mb-4 h-[600px] w-[450px] px-12 py-8 text-yellow-950">
                <h2 className="mb-4 text-xl">{question}</h2>
                {type === "radio" && (
                  <RadioInputs
                    onChange={(e) => handleResponse(e, index)}
                    resetTimer={handleTimer}
                    value={response as string}
                    options={options!}
                    name={questionId}
                    id={questionId}
                    className="mr-2"
                  />
                )}
                {type === "text" && (
                  <TextInput
                    onChange={(e) => handleResponse(e, index)}
                    resetTimer={handleTimer}
                    value={response}
                    name={questionId}
                    type="text"
                  />
                )}
                {type === "checkbox" && (
                  <CheckboxInputs
                    onChange={(e) => handleResponse(e, index)}
                    resetTimer={handleTimer}
                    value={response as string[]}
                    options={options!}
                    name={questionId}
                    id={questionId}
                    className="mr-2"
                  />
                )}
              </Card>
            </Swiper>
            <div className="shadow-pastel-yellow-400 relative z-10 flex justify-between py-4 shadow-[0_0_8px_8px]">
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
                <Popover open={fixResponseOpen}>
                  <PopoverTrigger asChild>
                    <Button onClick={handleSubmit}>제출</Button>
                  </PopoverTrigger>
                  <PopoverContent side="right" sideOffset={12}>
                    <p className="mb-4 text-center">
                      미완료 질문을 확인하시겠습니까?
                    </p>
                    <div className="flex justify-center">
                      <TimerButton
                        delay={validationDelay}
                        ref={validationClickRef}
                        current={validationCurrent}
                        end={validationEnd}
                        onClick={handleFixResponse}
                        className="mr-2"
                      >
                        네
                      </TimerButton>
                      <Button>그냥 제출할래요</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
