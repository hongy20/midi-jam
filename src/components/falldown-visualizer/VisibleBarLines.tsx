import { memo } from "react";

interface VisibleBarLinesProps {
  visibleBarLines: number[];
  pixelsPerSecond: number;
}

export const VisibleBarLines = memo(
  ({ visibleBarLines, pixelsPerSecond }: VisibleBarLinesProps) => {
    return (
      <>
        {visibleBarLines.map((time) => (
          <div
            key={`bar-${time}`}
            className="absolute left-0 right-0 h-px bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            style={{
              bottom: 0,
              // Position bar line relative to container bottom using pixels
              transform: `translate3d(0, ${-time * pixelsPerSecond}px, 0)`,
            }}
          />
        ))}
      </>
    );
  },
);

VisibleBarLines.displayName = "VisibleBarLines";
