"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/button/button";
import styles from "./carousel.module.css";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  selectedId: string | null;
  onSelect: (item: T) => void;
  onNext?: () => void;
  onPrev?: () => void;
  getItemId: (item: T) => string;
  className?: string;
  galleryClassName?: string;
  children?: ReactNode;
}

export function Carousel<T>({
  items,
  renderItem,
  selectedId,
  onSelect,
  onNext,
  onPrev,
  getItemId,
  className = "",
  galleryClassName = "",
  children,
}: CarouselProps<T>) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Handle scrolling to selected item (initial, resize, and selection changes)
  useEffect(() => {
    if (items.length === 0 || !selectedId) return;

    const scrollIntoCenter = (behavior: ScrollBehavior = "smooth") => {
      const container = scrollContainerRef.current;
      if (container) {
        const element = container.querySelector(
          `[data-item-id="${selectedId}"]`,
        );
        element?.scrollIntoView({
          behavior,
          block: "nearest",
          inline: "center",
        });
      }
    };

    // Initial scroll and selection changes use smooth by default
    scrollIntoCenter("smooth");

    const handleResize = () => scrollIntoCenter("instant");
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [items.length, selectedId]);

  const setupObserver = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      if (node) {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const itemId = entry.target.getAttribute("data-item-id");
                const item = items.find((i) => getItemId(i) === itemId);
                if (item && getItemId(item) !== selectedId) {
                  onSelect(item);
                }
              }
            }
          },
          {
            root: node,
            rootMargin: "0px -45% 0px -45%",
            threshold: 0.5,
          },
        );

        observerRef.current = observer;
      }
    },
    [items, selectedId, onSelect, getItemId],
  );

  const firstItem = items.at(0);
  const lastItem = items.at(-1);
  const isFirst = firstItem ? getItemId(firstItem) === selectedId : true;
  const isLast = lastItem ? getItemId(lastItem) === selectedId : true;

  return (
    <div className={`${styles.carousel} ${className}`}>
      <div
        ref={(node) => {
          scrollContainerRef.current = node;
          setupObserver(node);
        }}
        className={`${styles.gallery} ${galleryClassName}`}
      >
        {items.map((item) => {
          const id = getItemId(item);
          const isSelected = selectedId === id;

          return (
            <div
              key={id}
              data-item-id={id}
              ref={(el) => {
                if (el && observerRef.current) observerRef.current.observe(el);
              }}
              className="shrink-0 h-[80%] flex items-center"
            >
              {renderItem(item, isSelected)}
            </div>
          );
        })}
      </div>

      {onPrev && (
        <Button
          variant="secondary"
          icon={ChevronLeft}
          onClick={onPrev}
          disabled={isFirst}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 hidden sm:flex"
          aria-label="Previous item"
          size="sm"
        />
      )}

      {onNext && (
        <Button
          variant="secondary"
          icon={ChevronRight}
          onClick={onNext}
          disabled={isLast}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 hidden sm:flex"
          aria-label="Next item"
          size="sm"
        />
      )}

      {children}
    </div>
  );
}
