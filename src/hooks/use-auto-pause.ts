import { useEffect } from "react";

/**
 * Simplified useAutoPause hook: triggers immediately on focus loss or visibility change.
 */
export function useAutoPause(onPause: () => void) {
  useEffect(() => {
    const handleFocusLoss = () => {
      onPause();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        onPause();
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
