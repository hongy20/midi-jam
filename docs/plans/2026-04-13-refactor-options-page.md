# Refactor OptionsPage to 8bitcn Pattern

This refactor will bring `OptionsPage` in line with `GearPage` and `PausePage` architecture, moving logic to a client component and UI to a pure view component. It will also modernize the UI using the latest `8bitcn` components.

## User Review Required

> [!IMPORTANT]
>
> - **8bitcn Components**: I will be installing `@8bitcn/theme-selector`, `@8bitcn/difficulty-select`, and `@8bitcn/toggle` using `npx shadcn@latest add`.
> - **Difficulty Mapping**: "Difficulty" will map to the existing `speed` setting:
>   - **Easy**: 0.5x speed
>   - **Normal**: 1.0x speed
>   - **Hard**: 2.0x speed
> - **OptionItem Removal**: The old `OptionItem` component will be deprecated/removed as it's only used in `OptionsPage`.

## Proposed Changes

### [Preparation]

- [ ] Ensure branch `feature/options-refactor` is active
- [ ] Install 8bitcn components:
  - `npx shadcn@latest add @8bitcn/theme-selector`
  - `npx shadcn@latest add @8bitcn/difficulty-select`
  - `npx shadcn@latest add @8bitcn/toggle`

### [App Structure] `src/app/options`

#### [MODIFY] [page.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/page.tsx)

- Change to a simple wrapper that renders `OptionsPageClient`.
- Wrap in `Suspense` for hardware/URL state compatibility.

#### [NEW] [options-page.client.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/options-page.client.tsx)

- Consume `useOptions`, `useTheme`, `useNavigation`, and `useSearchParams`.
- Map state and setters to props for `OptionsPageView`.
- Implement mapping logic between `speed` (context) and `difficulty` (view).

#### [NEW] [options-page.view.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/options-page.view.tsx)

- Use `<main>` with full viewport classes (`h-dvh`, `w-screen`).
- Group settings into sections using `Card`.
- Implement `ThemeSelector` for themes.
- Implement `DifficultySelect` for game difficulty.
- Implement `Toggle` for Appearance (Dark Mode) and Autopilot.
- Add "Back" action; remove "Exit" button.

#### [NEW] [options-page.view.stories.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/app/options/components/options-page.view.stories.tsx)

- Create Storybook stories for the view component with various states.

### [Cleanup]

#### [DELETE] [option-item.tsx](file:///Users/yanhong/Github/hongy20/midi-jam/src/components/option-item/option-item.tsx)

- Remove the old shared component since it's no longer used.

## Verification Plan

### Automated Tests

- Run `npm run lint` (Biome)
- Run `npm run type-check` (TypeScript)
- Run `npm test` (Vitest)
- Run `npm run build` (Next.js build)

### Manual Verification

- Verify the new UI in the browser.
- Verify Storybook rendering.
- Test all settings (Theme, Mode, Difficulty, Autopilot) to ensure they persist and update the app correctly.
