# Design: Semantic Theme Refactor

Extract all hardcoded visual properties (colors, fonts, shadows, radii) into semantic CSS variables in `globals.css` to enable easy theme customization and maintain consistency across components.

## Goals
- Define a comprehensive set of semantic variables in `globals.css`.
- Support multiple themes (`neon`, `dark`, `light`) via CSS variable overrides.
- Remove hardcoded color, shadow, and radius values from CSS modules.
- Ensure the "Neon" theme remains the default and most vibrant.

## Architecture

### 1. `globals.css` Restructuring
Organize `globals.css` into three main layers:
1. **Global Constants:** Fixed spacing, layout, and font variables.
2. **Theme Primitive Variables:** Raw colors and opacity values for each theme.
3. **Semantic Mappings:** Component-level functional aliases (e.g., `--piano-key-white`) that resolve to primitive variables.

#### Example Variable Categories:
- **Piano Keyboard:** `--pk-key-white`, `--pk-key-black`, `--pk-glow-live-bg`, `--pk-glow-playback-bg`, `--pk-key-radius`.
- **Note Lanes:** `--lane-bg-white`, `--lane-bg-black`, `--note-radius`, `--note-bg-intensity`.
- **UI:** `--ui-accent`, `--ui-surface-low`, `--ui-surface-high`.

### 2. Component Refactoring
Update the following CSS modules to consume semantic variables:
- `piano-keyboard.module.css`
- `track-lane.module.css`
- `background-lane.module.css`

### 3. Data Flow
- `ThemeProvider` continues to set `data-theme` on `document.documentElement`.
- CSS modules automatically react to theme changes by reading the re-mapped semantic variables.

## Success Criteria
- [ ] No hardcoded HEX or RGBA colors in CSS modules (except for transparent/pure white/black).
- [ ] Changing a single variable in `globals.css` (e.g., `--pk-glow-live-bg`) updates all related components.
- [ ] Existing themes (`neon`, `dark`, `light`) look identical or improved.
- [ ] `npm test` and `npm run lint` pass.
