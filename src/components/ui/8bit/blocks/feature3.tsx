"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/8bit/badge";
import { Button } from "@/components/ui/8bit/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/8bit/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/8bit/carousel";
import { cn } from "@/lib/utils";

import "@/components/ui/8bit/styles/retro.css";

export interface CarouselFeature {
  badge?: string;
  description: string;
  icon: ReactNode;
  title: string;
}

interface FeatureAction {
  href?: string;
  label: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "ghost" | "outline" | "secondary";
  disabled?: boolean;
  className?: string;
}

interface Feature3Props {
  className?: string;
  description?: string;
  items?: CarouselFeature[];
  title?: string;
  onItemClick?: (item: CarouselFeature) => void;
  selectedItemTitle?: string;
  actions?: FeatureAction[];
}

const defaultItems: CarouselFeature[] = [
  {
    icon: "01",
    title: "Choose Your Class",
    description:
      "Warrior, Mage, or Rogue. Each with unique skill trees, gear sets, and playstyles.",
  },
  {
    icon: "02",
    title: "Enter the Dungeon",
    description:
      "Procedurally placed loot with hand-designed encounters. Every run feels fresh.",
    badge: "FAN FAVORITE",
  },
  {
    icon: "03",
    title: "Defeat Bosses",
    description:
      "12 legendary bosses, each with unique attack patterns. Learn, adapt, conquer.",
  },
  {
    icon: "04",
    title: "Upgrade Your Gear",
    description:
      "Combine drops at the forge to create legendary items. The grind is the game.",
  },
  {
    icon: "05",
    title: "Climb the Ranks",
    description:
      "Global leaderboards updated in real-time. Prove you are the best.",
    badge: "COMPETITIVE",
  },
];

export default function Feature3({
  title = "The Adventure Awaits",
  description = "Swipe through to discover what makes this game legendary",
  items = defaultItems,
  className,
  onItemClick,
  selectedItemTitle,
  actions = [],
}: Feature3Props) {
  return (
    <section className={cn("w-full px-4 py-16", className)}>
      <div className="mx-auto max-w-5xl text-center">
        {(title || description) && (
          <div className="mb-10">
            {title && (
              <h2 className="retro mb-3 font-bold text-2xl tracking-tight md:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <span className="mx-auto block max-w-xl retro text-muted-foreground text-[9px]">
                {description}
              </span>
            )}
          </div>
        )}

        <Carousel
          className="mx-auto w-full max-w-4xl"
          opts={{ align: "start", loop: false }}
        >
          <CarouselContent>
            {items.map((item) => {
              const isSelected = selectedItemTitle === item.title;
              return (
                <CarouselItem
                  className="pl-4 sm:basis-1/2 lg:basis-1/3"
                  key={item.title}
                >
                  <div className="h-full p-2">
                    <button
                      type="button"
                      onClick={() => onItemClick?.(item)}
                      className={cn(
                        "group relative h-full w-full text-left outline-none focus-visible:ring-4 focus-visible:ring-foreground transition-all active:scale-95",
                        !onItemClick && "cursor-default active:scale-100",
                      )}
                    >
                      <Card
                        className={cn(
                          "relative h-full transition-colors border-8",
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]"
                            : "border-foreground/10 hover:border-foreground/40",
                        )}
                      >
                        {item.badge && (
                          <div className="absolute top-2 right-4 z-10">
                            <Badge
                              className={cn(
                                "text-[7px]",
                                isSelected &&
                                  "bg-primary-foreground text-primary",
                              )}
                            >
                              {item.badge}
                            </Badge>
                          </div>
                        )}
                        <CardHeader className="pb-2">
                          <div
                            className={cn(
                              "retro mb-2 text-2xl",
                              isSelected
                                ? "text-primary-foreground"
                                : "text-foreground",
                            )}
                          >
                            {item.icon}
                          </div>
                          <CardTitle
                            className={cn(
                              "retro text-sm",
                              isSelected
                                ? "text-primary-foreground"
                                : "text-foreground",
                            )}
                          >
                            {item.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription
                            className={cn(
                              "retro text-[9px] leading-relaxed",
                              isSelected
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground",
                            )}
                          >
                            {item.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 bg-foreground text-background retro text-[7px] px-2 py-1 border-2 border-foreground z-20">
                          SELECTED
                        </div>
                      )}
                    </button>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        {actions.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {actions.map((action) =>
              action.href ? (
                <Button
                  asChild
                  key={action.label}
                  variant={action.variant}
                  className={cn("w-48", action.className)}
                  disabled={action.disabled}
                >
                  <Link href={action.href}>{action.label}</Link>
                </Button>
              ) : (
                <Button
                  key={action.label}
                  onClick={action.onClick}
                  variant={action.variant}
                  className={cn("w-48", action.className)}
                  disabled={action.disabled}
                >
                  {action.label}
                </Button>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}
