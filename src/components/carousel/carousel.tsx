"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { Button } from "@/components/ui/8bit/button";
import styles from "./carousel.module.css";

interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  selectedIndex: number;
  onSelectedIndexChange: (index: number) => void;
}

export function Carousel({
  children,
  selectedIndex,
  onSelectedIndexChange,
  className = "",
  ...props
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isProgrammaticScrollRef = useRef(false);
  const lastEmittedIndexRef = useRef(selectedIndex);

  const selectedIndexRef = useRef(selectedIndex);
  const onSelectRef = useRef(onSelectedIndexChange);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    onSelectRef.current = onSelectedIndexChange;
  }, [selectedIndex, onSelectedIndexChange]);

  const childrenArray = Children.toArray(children);
  const itemCount = childrenArray.length;

  // Initial scroll on mount
  useLayoutEffect(() => {
    if (itemCount === 0 || selectedIndex < 0 || selectedIndex >= itemCount)
      return;

    const container = scrollContainerRef.current;
    if (container) {
      const element = container.querySelector(
        `[data-index="${selectedIndex}"]`,
      );
      element?.scrollIntoView({
        behavior: "instant",
        block: "nearest",
        inline: "center",
      });
    }
  }, [itemCount, selectedIndex]);

  // Handle selection changes (via buttons, props, or dice)
  useEffect(() => {
    // If the change came from our own observer during a manual scroll, skip scrollIntoView
    if (
      selectedIndex === lastEmittedIndexRef.current &&
      !isProgrammaticScrollRef.current
    ) {
      return;
    }

    const container = scrollContainerRef.current;
    if (container) {
      const element = container.querySelector(
        `[data-index="${selectedIndex}"]`,
      );
      if (element) {
        // We are moving programmatically
        isProgrammaticScrollRef.current = true;
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }

    lastEmittedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const setupObserver = useCallback(() => {
    const node = scrollContainerRef.current;
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              const indexAttr = entry.target.getAttribute("data-index");
              if (indexAttr === null) continue;

              const index = Number.parseInt(indexAttr, 10);

              // If we reach the target of a programmatic scroll, release the lock
              if (index === selectedIndexRef.current) {
                isProgrammaticScrollRef.current = false;
              }

              // Trigger selection change if not in a programmatic scroll
              // or if we just arrived at the target
              if (
                !isProgrammaticScrollRef.current &&
                index !== selectedIndexRef.current
              ) {
                lastEmittedIndexRef.current = index;
                onSelectRef.current(index);
              }
            }
          }
        },
        {
          root: node,
          rootMargin: "0px -49% 0px -49%",
          threshold: 0,
        },
      );

      observerRef.current = observer;

      const items = node.querySelectorAll("[data-index]");
      for (const item of items) {
        observer.observe(item);
      }
    }
  }, []);

  useEffect(() => {
    setupObserver();
    return () => observerRef.current?.disconnect();
  }, [setupObserver]);

  const handlePrev = () => {
    if (selectedIndex > 0) {
      isProgrammaticScrollRef.current = true;
      onSelectedIndexChange(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < itemCount - 1) {
      isProgrammaticScrollRef.current = true;
      onSelectedIndexChange(selectedIndex + 1);
    }
  };

  const isFirst = selectedIndex <= 0;
  const isLast = selectedIndex >= itemCount - 1;

  return (
    <div className={`${styles.carousel} ${className}`} {...props}>
      <Button
        variant="secondary"
        onClick={handlePrev}
        disabled={isFirst}
        className={`${styles.prev} z-20 hidden sm:flex`}
        aria-label="Previous item"
        size="sm"
        font="retro"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {/* biome-ignore lint/a11y/noStaticElementInteractions: This is a scroll container with custom interaction tracking to handle programmatic vs manual scrolling. */}
      <div
        ref={scrollContainerRef}
        className={styles.gallery}
        onMouseDown={() => {
          isProgrammaticScrollRef.current = false;
        }}
        onTouchStart={() => {
          isProgrammaticScrollRef.current = false;
        }}
      >
        {childrenArray.map((child, index) => {
          if (!isValidElement(child)) return child;

          // biome-ignore lint/suspicious/noExplicitAny: cloneElement with ref is notoriously difficult to type with Children.toArray
          return cloneElement(child as any, {
            "data-index": index,
            ref: (node: HTMLElement | null) => {
              if (node && observerRef.current) {
                observerRef.current.observe(node);
              }
              // biome-ignore lint/suspicious/noExplicitAny: ref access on ReactElement requires casting or React 19 specific handling
              const { ref: childRef } = child as any;
              if (typeof childRef === "function") {
                childRef(node);
              } else if (childRef && "current" in childRef) {
                childRef.current = node;
              }
            },
          });
        })}
      </div>

      <Button
        variant="secondary"
        onClick={handleNext}
        disabled={isLast}
        className={`${styles.next} z-20 hidden sm:flex`}
        aria-label="Next item"
        size="sm"
        font="retro"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
