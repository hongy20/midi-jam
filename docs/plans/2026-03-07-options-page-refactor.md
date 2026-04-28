# Plan: Options Page Refactor

This plan outlines the refactor of the Options page to align with the newly established coding patterns and UI architecture standards defined in `AGENTS.md`.

## 1. Objectives

- **Deep Destructuring**: Consolidate `useAppContext` and `useTheme` calls to extract properties directly.
- **List Abstraction**: Abstract the repeating setting "cards" into a reusable `SettingItem` component.
- **Minimal DOM Nesting**: Flatten the `main` container and remove redundant wrapper `div`s.
- **Inline Handlers**: Replace simple wrapper functions with inline logic in event props.
- **UI Architecture**: Keep navigation actions in the `PageHeader` as per user preference.

## 2. Refactoring Details

### A. Context Consumption

**Current:**

```tsx
const { options } = useAppContext();
const { speed, setSpeed, demoMode, setDemoMode } = options;
const { theme, setTheme } = useTheme();
```

**Refactored:**

```tsx
const {
  options: { speed, setSpeed, demoMode, setDemoMode },
} = useAppContext();
const { theme, setTheme } = useTheme();
```

### B. List Abstraction

Create a `SettingItem` component within `src/app/options/page.tsx` to handle the layout of each setting row:

```tsx
interface SettingItemProps {
  title: string;
  description: string;
  children: React.ReactNode;
}
```

### C. DOM Nesting & Layout

- Replace `main className="grid grid-cols-1 gap-3 sm:gap-6"` with `main className="w-full h-full flex flex-col gap-6 py-4 px-8 max-w-5xl mx-auto"`.
- Simplify the inner logic of `SettingItem` to remove redundant wrappers.

### D. Navigation & Handlers

- **Header**: Change title to "System Settings". Keep `BackButton` (Back/Exit) in the header.
- **Footer**: Update to show standard branding: `Midi Jam v0.1.0 • Experimental Build`.
- **Inline Logic**:
  - Inline `toHome` and `goBack` logic in the header buttons.
  - Remove `BackButton` as a separate component if it only exists to house logic that can be inlined or handled with simpler hooks.

## 3. Proposed JSX Structure

```tsx
<PageLayout
  header={
    <PageHeader title="System Settings" icon={Settings}>
      <Suspense>
        <Button
          variant="secondary"
          onClick={() => goBack(searchParams.get("from") ?? "/")}
          size="sm"
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={() => toHome()}
          size="sm"
          icon={LogOut}
          iconPosition="right"
        >
          Exit
        </Button>
      </Suspense>
    </PageHeader>
  }
  footer={<PageFooter>Midi Jam v0.1.0 • Experimental Build</PageFooter>}
>
  <main className="mx-auto flex h-full w-full max-w-5xl flex-col gap-6 px-8 py-4">
    <SettingItem title="Visual Theme" description="Toggle global application style">
      {/* Theme Toggle logic inline */}
    </SettingItem>
    <SettingItem title="Playback Speed" description="Adjust note fall tempo">
      {/* Speed Toggle logic inline */}
    </SettingItem>
    <SettingItem title="Demo Mode" description="Auto-play previews without gear">
      {/* Switch logic inline */}
    </SettingItem>
  </main>
</PageLayout>
```

## 4. Verification Plan

- [ ] Verify `npm run lint` passes.
- [ ] Verify `npm run type-check` passes.
- [ ] Manual check: Navigation still works correctly with `searchParams` ("from" path).
- [ ] Manual check: Theme, Speed, and Demo mode toggles still update the global state.
