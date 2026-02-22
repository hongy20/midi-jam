// Minimal ScrollTimeline typing (enough for most React code)
declare global {
  interface ScrollTimeline extends AnimationTimeline {}

  interface ScrollTimelineOptions {
    source?: Element | Document;
    axis?: "block" | "inline" | "horizontal" | "vertical";
  }

  var ScrollTimeline: {
    prototype: ScrollTimeline;
    new (options?: ScrollTimelineOptions): ScrollTimeline;
  };
}

export {};
