"use client";

import { Piano } from "lucide-react";
import Link from "next/link";
import Feature3, {
  type CarouselFeature,
} from "@/components/ui/8bit/blocks/feature3";
import { Button } from "@/components/ui/8bit/button";
import { cn } from "@/lib/utils";
import { GearEmptyState } from "./gear-empty-state";

interface GearPageViewProps {
  inputs: WebMidi.MIDIInput[];
  selectedMIDIInput: WebMidi.MIDIInput | null;
  onSelect: (input: WebMidi.MIDIInput) => void;
  onContinue: () => void;
  onBack: () => void;
}

interface FeatureAction {
  href?: string;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "ghost" | "outline" | "secondary";
  disabled?: boolean;
  className?: string;
}

export function GearPageView({
  inputs,
  selectedMIDIInput,
  onSelect,
  onContinue,
  onBack,
}: GearPageViewProps) {
  const items: CarouselFeature[] = inputs.map((input) => ({
    icon: <Piano className="size-8" />,
    title: input.name || "Unknown Device",
    description: input.manufacturer || "Generic MIDI Input",
    badge: input.id === selectedMIDIInput?.id ? "ACTIVE" : undefined,
  }));

  const actions: FeatureAction[] = [
    {
      label: "MAIN MENU",
      onClick: onBack,
      variant: "secondary" as const,
    },
    {
      label: "CONTINUE",
      onClick: onContinue,
      variant: "default" as const,
      disabled: !selectedMIDIInput,
    },
  ];

  return (
    <main className="flex flex-col h-dvh items-center justify-center p-4">
      <div className="flex-1 w-full max-w-5xl flex items-center justify-center min-h-0">
        {inputs.length === 0 ? (
          <section className="w-full px-4 py-16">
            <div className="mx-auto max-w-5xl text-center">
              <GearEmptyState />
            </div>
          </section>
        ) : (
          <Feature3
            title="CHOOSE GEAR"
            description="Play a note on your gear to select it, or tap a card below."
            items={items}
            onItemClick={(item) => {
              const input = inputs.find(
                (i) => (i.name || "Unknown Device") === item.title,
              );
              if (input) onSelect(input);
            }}
            selectedItemTitle={selectedMIDIInput?.name || undefined}
          />
        )}
      </div>

      {actions.length > 0 && (
        <div className="w-full max-w-5xl mt-auto pb-12 flex flex-wrap justify-center gap-4 shrink-0">
          {actions.map((action) =>
            action.href ? (
              <Button
                asChild
                key={action.label}
                variant={action.variant}
                className={cn("w-48")}
                disabled={action.disabled}
              >
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button
                key={action.label}
                onClick={action.onClick}
                variant={action.variant}
                className={cn("w-48")}
                disabled={action.disabled}
              >
                {action.label}
              </Button>
            ),
          )}
        </div>
      )}
    </main>
  );
}
