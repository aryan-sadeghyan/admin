"use client";

import React from "react";
import { useDemoData } from "@/lib/seed-fallback";

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  // This will seed demo data if using the fallback system
  useDemoData();

  return <>{children}</>;
}
