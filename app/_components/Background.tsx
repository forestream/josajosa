"use client";

import { PropsWithChildren } from "react";

export default function Background({ children }: PropsWithChildren) {
  return <div className="bg-pastel-yellow-400 min-h-[100vh]">{children}</div>;
}
