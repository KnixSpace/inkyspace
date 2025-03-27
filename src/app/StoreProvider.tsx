"use client";

import { AppStore, makeStore } from "@/redux/store";
import { Provider } from "react-redux";
import { useRef, type ReactNode } from "react";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
