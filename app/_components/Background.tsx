"use client";

import { PropsWithChildren } from "react";

export default function Background({ children }: PropsWithChildren) {
  return <div className="min-h-[100vh] bg-yellow-200">{children}</div>;
}
