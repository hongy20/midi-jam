import { useCallback, useEffect, useRef } from "react";

/**
 * Custom hook to keep the screen awake using the Screen Wake Lock API.
 *
 * @param isActive - Whether the wake lock should be active.
 *
 * Benefits:
 * - Automatically requests wake lock when isActive is true.
 * - Releases wake lock when isActive is false or component unmounts.
 * - Re-requests wake lock on visibility change (locks are released by the browser when tab is hidden).
 */
export function useWakeLock(isActive: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) {
      return;
    }

    try {
      // Re-request only if we don't already have one
      if (!wakeLockRef.current) {
        wakeLockRef.current = await navigator.wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          wakeLockRef.current = null;
        });
      }
    } catch (err) {
      // Ignore errors (e.g. battery low, system policy)
      console.warn("Wake Lock request failed:", err);
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        console.warn("Wake Lock release failed:", err);
      }
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [isActive, requestWakeLock, releaseWakeLock]);

  // Handle visibility changes (wake locks are automatically released when the tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (isActive && document.visibilityState === "visible") {
        await requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, requestWakeLock]);
}
