"use client";

import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export interface Response {
  questionId: string;
  question: string;
  type: "radio" | "checkbox" | "text";
  response: string | string[];
}

export interface SurveyResponse {
  surveyId: string;
  surveyTitle: string;
  responses: Response[];
}

export default async function postResponse(surveyResponse: SurveyResponse) {
  const { surveyId, responses } = surveyResponse;

  responses.forEach(async (item) => {
    const { questionId, question, type, response } = item;

    await addDoc(collection(db, "surveys", surveyId, "responses"), {
      questionId,
      question,
      type,
      response,
      submittedAt: Timestamp.now(),
    });
  });
}
