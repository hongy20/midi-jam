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
  const isProgrammaticScrollRef = useRef(false);
  
  // Refs to keep track of latest values in observer callback without recreation
  const selectedIndexRef = useRef(selectedIndex);
  const onSelectRef = useRef(onSelectedIndexChange);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    onSelectRef.current = onSelectedIndexChange;
  }, [selectedIndex, onSelectedIndexChange]);

  // Mark as programmatic scroll when index changes via props/buttons
  useEffect(() => {
    isProgrammaticScrollRef.current = true;
  }, [selectedIndex]);

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

    scrollIntoCenter("smooth");

    const handleResize = () => scrollIntoCenter("instant");
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemCount, selectedIndex]);

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

              // Only trigger selection change if NOT in a programmatic scroll
              // or if we've already reached/passed the target
              if (!isProgrammaticScrollRef.current && index !== selectedIndexRef.current) {
                onSelectRef.current(index);
              }
            }
          }
        },
        {
          root: node,
          // 10% hit zone in the center (45% + 45% = 90% margin)
          rootMargin: "0px -45% 0px -45%",
          threshold: 0.5,
        },
      );

      observerRef.current = observer;

      // Observe all current children
      const items = node.querySelectorAll("[data-index]");
      for (const item of items) {
        observer.observe(item);
      }
    }
  }, []);

  // Initialize observer once
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
        icon={ChevronLeft}
        onClick={handlePrev}
        disabled={isFirst}
        className={`${styles.prev} z-20 hidden sm:flex`}
        aria-label="Previous item"
        size="sm"
      />

      <div
        ref={scrollContainerRef}
        className={styles.gallery}
      >
        {childrenArray.map((child, index) => {
          if (!isValidElement(child)) return child;

          return cloneElement(child as React.ReactElement<any>, {
            "data-index": index,
            ref: (node: HTMLElement | null) => {
              // Observe the element if it's new
              if (node && observerRef.current) {
                observerRef.current.observe(node);
              }
              // Handle the child's own ref
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
