"use client";

import { useEffect } from "react";
import { firebaseApp } from "@/lib/firebase";

export function FirebasePerf() {
  useEffect(() => {
    import("firebase/performance").then(({ getPerformance }) => {
      getPerformance(firebaseApp);
    });
  }, []);

  return null;
}
