"use client";

import postSurvey from "@/utils/postSurvey";
import { ChangeEvent, FormEvent, useState, useTransition } from "react";

export default function Page() {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setValue(e.target.value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const survey = formData.get("survey") as string;

    if (!survey) return;

    const surveyObj = JSON.parse(survey);

    startTransition(async () => {
      await postSurvey(surveyObj);
      setValue("");
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex flex-col items-center justify-center py-4"
    >
      <textarea
        name="survey"
        className="min-h-[800px] w-[600px] resize-none rounded bg-white p-2"
        value={value}
        onChange={handleChange}
      />
      <button className="cursor-pointer" disabled={isPending}>
        추가
      </button>
    </form>
  );
}
