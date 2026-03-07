"use client";

import { LogOut, Settings } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/button/button";
import {
  OptionItem,
  type OptionType,
} from "@/components/option-item/option-item";
import { PageFooter } from "@/components/page-footer/page-footer";
import { PageHeader } from "@/components/page-header/page-header";
import { PageLayout } from "@/components/page-layout/page-layout";
import { useNavigation } from "@/hooks/use-navigation";

function BackButton() {
  const { goBack } = useNavigation();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";

  return (
    <Button variant="secondary" onClick={() => goBack(from)} size="sm">
      Back
    </Button>
  );
}

export default function OptionsPage() {
  const { toHome } = useNavigation();
  const optionTypes: OptionType[] = ["theme", "speed", "demo"];

  return (
    <PageLayout
      header={<PageHeader title="Settings" icon={Settings} />}
      footer={
        <PageFooter>
          <Suspense fallback={<div className="w-20" />}>
            <BackButton />
          </Suspense>
          <Button
            variant="primary"
            onClick={() => toHome()}
            size="sm"
            icon={LogOut}
            iconPosition="right"
          >
            Exit
          </Button>
        </PageFooter>
      }
    >
      <main className="flex flex-col gap-4 py-4 sm:py-8 px-8 overflow-hidden">
        {optionTypes.map((type) => (
          <OptionItem key={type} type={type} className="flex-1" />
        ))}
      </main>
    </PageLayout>
  );
}
