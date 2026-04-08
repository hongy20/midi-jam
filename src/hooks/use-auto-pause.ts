import { useEffect, useRef } from "react";

/**
 * Hook to automatically trigger a pause callback when the window loses focus
 * or the document becomes hidden (e.g., tab switch).
 *
 * It includes a 100ms debounce guard to prevent double-firing on simultaneous events.
 */
export function useAutoPause(onPause: () => void) {
  const lastTriggeredRef = useRef<number>(0);
  const DEBOUNCE_MS = 100;

  useEffect(() => {
    const triggerPauseWithDebounce = () => {
      const now = Date.now();
      if (now - lastTriggeredRef.current < DEBOUNCE_MS) {
        return;
      }
      lastTriggeredRef.current = now;
      onPause();
    };

    const handleFocusLoss = () => {
      triggerPauseWithDebounce();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        triggerPauseWithDebounce();
      }
    };

    window.addEventListener("blur", handleFocusLoss);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("blur", handleFocusLoss);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [onPause]);
}
