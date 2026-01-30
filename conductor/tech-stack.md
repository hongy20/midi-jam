# Tech Stack

This document outlines the core technologies and tools used in the project.

## Frontend
-   **Framework**: [Next.js](https://nextjs.org) (v16)
-   **UI Library**: [React](https://react.dev) (v19)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com) (v4)

## Tooling
-   **Linting & Formatting**: [Biome](https://biomejs.dev)
-   **Testing**: [Vitest](https://vitest.dev) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Implementation Guidelines
-   **Visual Effects**:
    -   **Pure CSS**: All animations and visual effects must be implemented using pure CSS (transitions, animations) or DOM-based manipulation via React/Tailwind.
    -   **No Canvas**: Do NOT use the HTML5 `<canvas>` element for rendering visual effects. The UI should be DOM-based to ensure accessibility and ease of styling with Tailwind CSS.
