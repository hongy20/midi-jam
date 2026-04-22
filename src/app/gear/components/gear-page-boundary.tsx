"use client";

import dynamic from "next/dynamic";

import Loading from "@/app/loading";

const GearPageClient = dynamic(
  () => import("./gear-page.client").then((mod) => mod.GearPageClient),
  {
    ssr: false,
    loading: () => <Loading />,
  },
);

export function GearPageBoundary() {
  return <GearPageClient />;
}
