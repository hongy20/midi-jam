# Design Doc: Collection Gallery (Horizontal Scroll Snap)

## Overview
Transform the `CollectionPage` into a high-end horizontal gallery where songs are presented as cards that snap to the center of the screen. As a user scrolls, the centered song is automatically selected and visually highlighted with a scale-up effect.

## User Experience (UX)
- **Horizontal Gallery**: Songs are laid out in a single horizontal row.
- **Scroll Snap**: The gallery uses native CSS scroll snapping to ensure a card always rests perfectly in the center.
- **Snap Center + Scale**: The centered (selected) card is 10-15% larger than the surrounding cards.
- **Auto-Select on Scroll**: As a song snaps to the center, it becomes the active selection for the game without requiring a click.
- **Fluid Transitions**: Smooth CSS transitions for scaling and visual highlights (glow, color shifts).

## Technical Architecture

### 1. Intersection Detection (Center "Hit Box")
We will use the `IntersectionObserver` API to detect which card is currently centered.
- **Root**: The horizontal scroll container.
- **RootMargin**: A narrow vertical strip in the center (e.g., `0px -45% 0px -45%`).
- **Threshold**: `0.5` or `1.0` to ensure the card is substantially within the center zone.
- **Logic**: When a card enters this center strip, `setSelectedTrack` is called.

### 2. Layout & Physics (CSS Scroll Snap)
- **Container**:
  ```css
  display: flex;
  overflow-x: auto;
  snap-type: x mandatory;
  scroll-behavior: smooth;
  padding-inline: 40vw; /* Allows first/last items to reach center */
  ```
- **TrackCard**:
  ```css
  scroll-snap-align: center;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  ```

### 3. Data Flow
1. **`CollectionPage`** fetches tracks and renders them in the scroll container.
2. **`useIntersectionObserver`** (custom hook or inline logic) observes each `TrackCard`.
3. When a card intersects the center "hit box", it updates the `selectedTrack` in the `CollectionContext`.
4. The `TrackCard` receives the `isSelected` prop and applies the `.selected` class (triggering the scale-up transition).

## Component Updates

### `TrackCard` (`src/components/track-card/`)
- Add `.selected` class styles with `transform: scale(1.1)`.
- Ensure the card is a `div` or `button` that behaves well within a flex-row (no fixed `100%` width).

### `CollectionPage` (`src/app/collection/`)
- Implement the `IntersectionObserver` logic.
- Update the layout from a vertical list to a horizontal flex container.
- Add "Empty State" and "Loading" handling that fits the horizontal aesthetic.

## Testing Strategy
- **Manual**: Verify scroll snapping on various screen sizes (Mobile, Tablet, Desktop).
- **Manual**: Confirm "Auto-Selection" updates the "PLAY" button state in the footer immediately.
- **Unit**: Mock `IntersectionObserver` to verify state updates when a card "intersects" the center.
