import { useEffect, useRef } from "react";

/**
 * Hook to automatically trigger a pause callback when the window loses focus
 * or the document becomes hidden (e.g., tab switch).
 *
 * It includes a small debounce/guard to prevent double-firing when both
 * 'blur' and 'visibilitychange' trigger at the same time.
 */
export function useAutoPause(onPause: () => void) {
  const lastTriggeredRef = useRef<number>(0);
  const DEBOUNCE_MS = 100;

  useEffect(() => {
    const handlePauseTrigger = () => {
      const now = Date.now();
      if (now - lastTriggeredRef.current < DEBOUNCE_MS) {
        return;
      }

      // Check if we should actually pause
      const isHidden = document.visibilityState === "hidden";
      const isUnfocused = !document.hasFocus();

      if (isHidden || isUnfocused) {
        lastTriggeredRef.current = now;
        onPause();
      }
    };

    window.addEventListener("blur", handlePauseTrigger);
    document.addEventListener("visibilitychange", handlePauseTrigger);

    return () => {
      window.removeEventListener("blur", handlePauseTrigger);
      document.removeEventListener("visibilitychange", handlePauseTrigger);
    };
  }, [onPause]);
}
