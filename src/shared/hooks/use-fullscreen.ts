import { useCallback, useEffect, useState } from "react";

/**
 * Custom hook to manage fullscreen state and screen orientation lock.
 *
 * Benefits:
 * - Syncs `isFullscreen` state with the browser's actual state (handles Esc key).
 * - Attempts to lock the screen to landscape when entering fullscreen.
 * - Gracefully handles browser support for both Fullscreen and Orientation APIs.
 */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();

        // Attempt to lock orientation to landscape if supported.
        // Screen orientation API is primarily a mobile feature.
        if (typeof screen !== "undefined" && screen.orientation && "lock" in screen.orientation) {
          try {
            // @ts-expect-error - orientation.lock is not always in standard DOM types but widely supported
            await screen.orientation.lock("landscape");
          } catch (orientationError) {
            // Browsers might reject this on desktop or if user hasn't interacted enough.
            console.warn("Screen orientation lock failed:", orientationError);
          }
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error);
    }
  }, []);

  return { isFullscreen, toggleFullscreen };
}
