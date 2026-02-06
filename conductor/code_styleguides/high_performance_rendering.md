# High-Performance Rendering & Architectural Patterns

This document outlines key architectural principles and performance patterns learned from the MIDI Jam rendering engine refactor. These should be followed to minimize future refactoring and ensure 60fps stability.

## 1. Native Engine First (Layout)
- **Principle**: Offload layout responsibilities to the browser's native C++ engine (CSS Grid/Flexbox) rather than calculating coordinates in JavaScript.
- **Implementation**: 
    - Use **CSS Grid** for complex physical structures (like a piano keyboard).
    - Use `grid-column`, `grid-row`, and `grid-area` for positioning.
    - Avoid manual `left`, `top`, `width`, and `height` calculations in React.

## 2. High-Frequency State vs. DOM Density
- **Principle**: Minimize the number of DOM nodes React has to diff during high-frequency updates.
- **Implementation**:
    - **Layer Separation**: Split components into a **Static Layer** (rendered once or on range change) and a **Dynamic Layer** (rendered only for active events).
    - **Active-Only Rendering**: In the dynamic layer, only render elements for nodes that are *currently* active. Do not render a full set of elements and toggle their visibility.

## 3. Composite-Only Visual Updates
- **Principle**: Use GPU-accelerated CSS properties to prevent layout reflows and heavy repaints.
- **Implementation**:
    - Use **Data Attributes** (e.g., `data-active="true"`) to trigger visual states.
    - Limit high-frequency style updates to **composite-only properties**: `opacity` and `transform` (`translate3d`, `scale`).
    - Move expensive visual definitions (complex gradients, box-shadows) to static CSS classes.

## 4. Geometry-Aware Grid Resolution
- **Principle**: Choose a grid resolution that matches the physical geometry of the object to enable integer-based positioning.
- **Implementation**:
    - For a piano, use **21 units per octave** (3 per white key, 2 per black key). This allows black keys to sit exactly on the boundaries of white keys without sub-pixel gaps.

## 5. Isolation of the Clock from the State
- **Principle**: Decouple high-resolution timing logic from the UI state to prevent recursive feedback loops and stalling.
- **Implementation**:
    - Use a **State-Isolated Hook** (e.g., `usePlaybackClock`) for the RAF loop.
    - Store high-frequency values (startTime, currentPosition) in `useRef`.
    - Only push to `useState` for UI synchronization. Never make the engine's logic dependent on the state variables it updates.

## 6. 3D Stacking Context Awareness
- **Principle**: Prevent Z-fighting and plane intersection artifacts in 3D perspective modes.
- **Implementation**:
    - Be **explicitly hierarchical** with stacking contexts.
    - Give interactive foreground components their own context using `relative z-index`.
    - Strictly contain background effects with `overflow: hidden` and lower `z-index` to prevent spillover during 3D rotation (`rotateX`).
