"use client";

import { getDocs, Query, QueryDocumentSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useGetDocs(query: Query | null) {
  const [docs, setDocs] = useState<QueryDocumentSnapshot[]>([]);

  useEffect(() => {
    if (!query) return;

    (async () => {
      const newDocs = await getDocs(query);
      setDocs(() => newDocs.docs.map((doc) => doc));
    })();
  }, [query]);

  return docs;
}
