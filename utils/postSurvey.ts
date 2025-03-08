import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";

export interface Question {
  question: string;
  type: "checkbox" | "radio" | "text";
  options?: string[];
}

export interface Survey {
  title: string;
  questions: Question[];
}

export default async function postSurvey(survey: Survey) {
  const { title, questions } = survey;

  const newDoc = await addDoc(collection(db, "surveys"), {
    title,
  });

  questions.forEach(async (item) => {
    const { question, type, options } = item;

    await addDoc(collection(db, "surveys", newDoc.id, "questions"), {
      question,
      type,
      options: options ?? null,
    });
  });
}
