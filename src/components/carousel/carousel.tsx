"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Button } from "@/components/button/button";
import styles from "./carousel.module.css";

interface CarouselProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  children: ReactNode;
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function Carousel({
  children,
  selectedIndex,
  onSelect,
  className = "",
  ...props
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const childrenArray = Children.toArray(children);
  const itemCount = childrenArray.length;

  // Handle scrolling to selected index (initial, resize, and selection changes)
  useEffect(() => {
    if (itemCount === 0 || selectedIndex < 0 || selectedIndex >= itemCount)
      return;

    const scrollIntoCenter = (behavior: ScrollBehavior = "smooth") => {
      const container = scrollContainerRef.current;
      if (container) {
        const element = container.querySelector(
          `[data-index="${selectedIndex}"]`,
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
  }, [itemCount, selectedIndex]);

  const setupObserver = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      if (node) {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const index = Number.parseInt(
                  entry.target.getAttribute("data-index") || "-1",
                  10,
                );
                if (index !== -1 && index !== selectedIndex) {
                  onSelect(index);
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
    [selectedIndex, onSelect],
  );

  const handlePrev = () => {
    if (selectedIndex > 0) {
      onSelect(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < itemCount - 1) {
      onSelect(selectedIndex + 1);
    }
  };

  const isFirst = selectedIndex <= 0;
  const isLast = selectedIndex >= itemCount - 1;

  return (
    <div className={`${styles.carousel} ${className}`} {...props}>
      <div
        ref={(node) => {
          scrollContainerRef.current = node;
          setupObserver(node);
        }}
        className={styles.gallery}
      >
        {childrenArray.map((child, index) => {
          const key =
            child && typeof child === "object" && "key" in child && child.key
              ? child.key
              : index;

          return (
            <div
              key={key}
              data-index={index}
              ref={(el) => {
                if (el && observerRef.current) observerRef.current.observe(el);
              }}
              className="shrink-0 h-[80%] flex items-center"
            >
              {child}
            </div>
          );
        })}
      </div>

      <Button
        variant="secondary"
        icon={ChevronLeft}
        onClick={handlePrev}
        disabled={isFirst}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 hidden sm:flex"
        aria-label="Previous item"
        size="sm"
      />

      <Button
        variant="secondary"
        icon={ChevronRight}
        onClick={handleNext}
        disabled={isLast}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 hidden sm:flex"
        aria-label="Next item"
        size="sm"
      />
    </div>
  );
}
