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
      BACK
    </Button>
  );
}

export default function OptionsPage() {
  const { toHome } = useNavigation();
  const optionTypes: OptionType[] = ["theme", "speed", "demo"];

  return (
    <PageLayout
      header={
        <PageHeader title="SYSTEM SETTINGS">
          <div className="retro text-[10px] opacity-40 uppercase tracking-widest hidden sm:block">
            Configuration Panel
          </div>
        </PageHeader>
      }
      footer={
        <PageFooter>
          <Suspense fallback={<div className="w-20" />}>
            <BackButton />
          </Suspense>
          <Button onClick={() => toHome()} size="sm" font="retro">
            QUIT TO MENU
            <LogOut className="size-4 ml-2" />
          </Button>
        </PageFooter>
      }
    >
      <main className="flex flex-col gap-6 py-8 px-4 sm:px-8 max-w-4xl mx-auto w-full overflow-y-auto no-scrollbar">
        <div className="text-center mb-4">
          <div className="inline-block bg-accent px-4 py-2 border-4 border-foreground dark:border-ring retro text-[10px] uppercase tracking-widest mb-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            ENVIRONMENT PARAMETERS
          </div>
        </div>

        {optionTypes.map((type) => (
          <OptionItem key={type} type={type} className="w-full" />
        ))}

        <div className="mt-8 p-6 border-8 border-foreground/10 flex flex-col items-center gap-4 opacity-40">
          <Settings className="size-12 animate-spin-slow" />
          <p className="retro text-[8px] uppercase tracking-[0.2em]">
            Engine Version 1.0.4-Retro
          </p>
        </div>
      </main>
    </PageLayout>
  );
}
