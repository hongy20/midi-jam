# Refactor OptionsPage Layout to Carousel

This plan refactors the Options page to use a horizontal Carousel for settings instead of a vertical flex-column, solving the vertical overlap / broken scrolling on mobile landscape mode. It also extracts the responsive carousel item sizing logic into a reusable CSS class.

## User Review Required

> [!NOTE]
> Review the responsive break points below. The new class `.jam-carousel-item` will make items take:
> - 100% width on Mobile (1 item visible)
> - 50% width on Small Tablet (2 items visible)
> - 33.3% width on Large Tablet/Desktop (3 items visible)

## Proposed Changes

### Styles
#### [MODIFY] base.css (file:///Users/yanhong/Github/hongy20/midi-jam/src/styles/base.css)
- Add a new `.jam-carousel-item` utility class in `@layer components`.

### UI Components
#### [MODIFY] collection-page.view.tsx (file:///Users/yanhong/Github/hongy20/midi-jam/src/app/collection/components/collection-page.view.tsx)
- Replace inline class `basis-[100%] sm:basis-1/2 lg:basis-1/3` with the new `.jam-carousel-item` class on its `CarouselItem`.

#### [MODIFY] options-page.view.tsx (file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/options-page.view.tsx)
- Import `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselNext`, and `CarouselPrevious` from `8bit/carousel`.
- Replace the `<div className="w-full max-w-2xl flex flex-col gap-6 overflow-y-auto no-scrollbar">` wrapper with the `Carousel` layout.
- Wrap each settings `<Card>` inside a `<CarouselItem className="pl-4 jam-carousel-item">`.
- Wrap the Carousel inside `<div className="w-full px-12 md:px-16 overflow-visible">` to leave room for the previous/next arrows, matching the CollectionPage layout.

### Card Structure & Alignment
#### [MODIFY] options-page.view.tsx (file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/options-page.view.tsx)
- Refactor card internal structure: Move `CardTitle`, `p` (description), and controls into a single `CardContent` with `flex flex-col h-full justify-between`.
- Standardize vertical alignment by anchoring elements to the top (Title) and bottom (Action) of the card.

## Verification Plan

### Automated Tests
- Run `npm run lint` and `npm run type-check`.
- Build the project with `npm run build`.
- Run unit tests with `npm test`.

### Manual Verification
- View `OptionsPage` in Storybook using the Mobile2 viewport, rotated to landscape. Ensure all three settings are paged correctly and the "Back" button does not overlap.
- **Alignment Check**: Observe the Visual Theme dropdown and Difficulty selector in Storybook rows; verify they align horizontally exactly, with Titles sharing a common topline.
- View `CollectionPage` in Storybook or dev server to ensure songs are still correctly stacked across screen sizes.
