"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Children,
  type HTMLAttributes,
  type ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { Button } from "@/components/button/button";
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
                  onSelectedIndexChange(index);
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
    [selectedIndex, onSelectedIndexChange],
  );

  const handlePrev = () => {
    if (selectedIndex > 0) {
      onSelectedIndexChange(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < itemCount - 1) {
      onSelectedIndexChange(selectedIndex + 1);
    }
  };

  const isFirst = selectedIndex <= 0;
  const isLast = selectedIndex >= itemCount - 1;

  return (
    <div className={`${styles.carousel} ${className}`} {...props}>
      <Button
        variant="secondary"
        icon={ChevronLeft}
        onClick={handlePrev}
        disabled={isFirst}
        className={`${styles.prev} z-20 hidden sm:flex`}
        aria-label="Previous item"
        size="sm"
      />

      <div
        ref={(node) => {
          scrollContainerRef.current = node;
          setupObserver(node);
        }}
        className={styles.gallery}
      >
        {childrenArray.map((child, index) => {
          if (!isValidElement(child)) return child;

          return cloneElement(child as React.ReactElement<any>, {
            "data-index": index,
            ref: (node: HTMLElement | null) => {
              // Observe the element
              if (node && observerRef.current) {
                observerRef.current.observe(node);
              }
              // Handle the child's own ref if it's a function ref or RefObject
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
        icon={ChevronRight}
        onClick={handleNext}
        disabled={isLast}
        className={`${styles.next} z-20 hidden sm:flex`}
        aria-label="Next item"
        size="sm"
      />
    </div>
  );
}
