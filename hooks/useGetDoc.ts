"use client";

import {
  DocumentReference,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useGetDoc(docRef: DocumentReference) {
  const [doc, setDoc] = useState<DocumentSnapshot>();

  useEffect(() => {
    (async () => {
      const newDoc = await getDoc(docRef);
      setDoc(newDoc);
    })();
  }, [docRef]);

  return doc;
}
