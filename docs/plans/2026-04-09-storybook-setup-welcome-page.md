# Plan: Storybook Setup & Welcome Page Refactor

Setting up Storybook with theme support, responsive viewports, and refactoring the Welcome Page into a View/Container pattern. Also adding global Light/Dark mode support.

## 1. Infrastructure Setup

### 1.1 Install Dependencies
- Install `@storybook/addon-themes` as a dev dependency.

### 1.2 Storybook Configuration
- Update `.storybook/main.ts` to include `@storybook/addon-themes`.
- Update `.storybook/preview.ts`:
  - Add `withThemeByDataAttribute` decorator using `THEME_DEFAULT` and `THEME_NINTENDO`.
  - Add custom viewports for common devices (Phone Portrait/Landscape, Tablet, Desktop).
  - Ensure `PageLayout` styles are supported (may need a decorator if layout depends on global styles not in `globals.css`).

## 2. Welcome Page Refactor (View/Container Pattern)

### 2.1 Create `WelcomePageView`
- Path: `src/app/welcome-page.view.tsx`
- Props: `isLoading: boolean`, `isSupported: boolean`, `onStart: () => void`, `onOptions: () => void`.
- This will be the "Pure" component used in Storybook.

### 2.2 Update `WelcomePage` (Container)
- Path: `src/app/page.tsx`
- Use `useHome()`, `useNavigation()`, and `useAppReset()`.
- Pass necessary data and callbacks to `WelcomePageView`.

### 2.3 Create Stories
- Path: `src/app/welcome-page.view.stories.tsx`
- Stories: `Loading`, `Ready`, `Unsupported`.

## 3. Light/Dark Mode Implementation

### 3.1 Update `ThemeContext`
- Add `mode` ('light' | 'dark' | 'system') to `ThemeContextType`.
- Update `ThemeProvider` to persist `mode` in `localStorage`.
- Sync `mode` with `document.documentElement.classList.add('dark')` / `remove('dark')`.

### 3.2 Update CSS Selectors
- Verify `src/styles/themes/*.css` use `:root[data-theme="..."]` and `.dark` correctly.
- Ensure the `.dark` class is applied to `html` or `body`.

### 3.3 Add Toggle (Optional but good for verification)
- Add a "Appearance" section in `src/app/options/page.tsx` with a Light/Dark toggle.

## 4. Verification

### 4.1 Testing
- Ensure existing tests in `src/app/page.test.tsx` pass (might need minor updates due to refactor).
- Add new test cases if necessary.

### 4.2 Quality Checks
- Run `npm run lint` (Biome).
- Run `npm run type-check`.
- Run `npm test`.
- Run `npm run build`.
- Verify Storybook locally.

## 5. Finalization
- Create PR using `gh pr create --fill`.
- Wait for user confirmation before merge.
