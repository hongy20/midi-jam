"use client";

import { type ReactNode, useCallback, useEffect, useRef } from "react";
import styles from "./carousel.module.css";

interface CarouselProps<T> {
  items: T[];
  renderItem: (item: T, isSelected: boolean) => ReactNode;
  selectedId: string | null;
  onSelect: (item: T) => void;
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
      {children}
    </div>
  );
}
