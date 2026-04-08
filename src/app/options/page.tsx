"use client";

import { ArrowLeft, LogOut, Settings } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  OptionItem,
  type OptionType,
} from "@/components/option-item/option-item";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { Button } from "@/components/ui/8bit/button";
import { useNavigation } from "@/hooks/use-navigation";

function BackButton() {
  const { goBack } = useNavigation();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";

  return (
    <Button
      variant="secondary"
      onClick={() => goBack(from)}
      size="sm"
      font="retro"
    >
      <ArrowLeft className="size-4 mr-2" />
      Back
    </Button>
  );
}

export default function OptionsPage() {
  const { toHome } = useNavigation();
  const optionTypes: OptionType[] = ["theme", "speed", "demo"];

  return (
    <PageLayout
      header={<PageHeader title="Settings" />}
      footer={
        <PageFooter>
          <Suspense fallback={<div className="w-20" />}>
            <BackButton />
          </Suspense>
          <Button onClick={() => toHome()} size="sm" font="retro">
            Exit
            <LogOut className="size-4 ml-2" />
          </Button>
        </PageFooter>
      }
    >
      <main className="flex flex-col gap-6 py-8 px-4 sm:px-8 max-w-4xl mx-auto w-full overflow-y-auto no-scrollbar">
        {optionTypes.map((type) => (
          <OptionItem key={type} type={type} className="w-full" />
        ))}

        <footer className="mt-8 p-6 border-8 border-foreground/10 flex flex-col items-center gap-4 opacity-40">
          <Settings className="size-12 animate-spin-slow" />
          <p className="retro text-[8px] uppercase tracking-[0.2em]">
            Engine Version 1.0.4-Retro
          </p>
        </footer>
      </main>
    </PageLayout>
  );
}
