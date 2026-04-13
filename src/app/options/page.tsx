"use client";
import { Suspense } from "react";
import { OptionsPageClient } from "./components/options-page.client";

/**
 * OptionsPage - Root Entry
 * Following the GearPage/PausePage pattern.
 */
export default function OptionsPage() {
  return (
    <Suspense fallback={<div className="h-dvh w-screen bg-background" />}>
      <OptionsPageClient />
    </Suspense>
  );
}
