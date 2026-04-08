import { useEffect } from "react";

/**
 * Simplified useAutoPause hook: triggers immediately on focus loss or visibility change.
 */
export function useAutoPause(onPause: () => void) {
  useEffect(() => {
    console.log("[AutoPause] Hook initialized!");

    const handleFocusLoss = () => {
      console.log("[AutoPause] FOCUS LOSS TRIGGER!!");
      onPause();
    };

    const handleVisibility = () => {
      console.log("[AutoPause] VISIBILITY TRIGGER!! state:", document.visibilityState);
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
