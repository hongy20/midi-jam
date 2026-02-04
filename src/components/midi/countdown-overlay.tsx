"use client";

import { memo } from "react";

interface CountdownOverlayProps {
  countdownRemaining: number;
  isActive: boolean;
}

export const CountdownOverlay = memo(function CountdownOverlay({
  countdownRemaining,
  isActive,
}: CountdownOverlayProps) {
  if (!isActive || countdownRemaining === 0) return null;

  const getDisplayText = () => {
    switch (countdownRemaining) {
      case 4:
        return "3";
      case 3:
        return "2";
      case 2:
        return "1";
      case 1:
        return "GO!";
      default:
        return "";
    }
  };

  const displayText = getDisplayText();

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div 
        key={countdownRemaining}
        className="text-8xl md:text-9xl font-black text-white drop-shadow-[0_5px_25px_rgba(0,0,0,0.8)] animate-countdown"
      >
        {displayText}
      </div>
    </div>
  );
});
