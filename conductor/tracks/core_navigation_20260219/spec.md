# Specification - Core Navigation Pages Implementation

## Overview
Implement the core pages of the application flow: Welcome, Instrument Selection, Sound Track Selection, Results, and Settings. These pages will provide a structured, game-like user journey, strictly adhering to the project's established navigation and performance principles.

## Functional Requirements

### 1. Welcome (Root) Page (`/`)
- **UI**: Feature the "MIDI JAM" title with an animated logo and a prominent volume warning.
- **Actions**:
    - **Primary**: "START JAM ▶️" (Navigates to `/instruments`).
    - **Secondary**: "Settings ⚙️" (Navigates to `/settings?from=/`).

### 2. Instrument Selection Page (`/instruments`)
- **Selection Logic**:
    - Use Web MIDI API to populate devices.
    - **No auto-selection** on mount.
    - **Automatic selection** occurs only when a device sends a MIDI message.
- **UI**: Interactive cards with a "pulse" effect on MIDI input.
- **Navigation**: "CONTINUE ▶️" (Enabled only after selection, navigates to `/tracks`).

### 3. Sound Track Selection Page (`/tracks`)
- **Data**: Load via `getSoundTracks` server action (extended with difficulty/titles).
- **Features**: Song preview capability and a "Surprise 🎲" randomizer.
- **Navigation**:
    - **Primary**: "PLAY ▶️" (Navigates to `/game`).
    - **Secondary**: "Instrument Setup 🎹" (Navigates back to `/instruments`).

### 4. Game & Results Integration
- **Game Page (`/game`)**: On session end, generate randomized results (Score, Accuracy, Combo) and save to `SelectionContext`.
- **Results Page (`/results`)**:
    - Display performance metrics and a rating.
    - **Dynamic Header**: Varies based on accuracy (0-40%, 41-70%, 71-90%, 91-100%).
    - **Navigation**: "PLAY AGAIN", "NEXT SONG ▶️", and "MAIN MENU".

### 5. Settings Page (`/settings`)
- **Configurations**:
    - **Speed**: 3-step discrete slider (Slow, Normal, Fast).
    - **Theme**: App-wide toggle (Neon, Dark, Light).
    - **Demo Mode**: Toggle switch.
- **Navigation**: "BACK" and "EXIT 🚪" (Back to Welcome).

## Technical & Navigation Rules
- **History Neutrality**: All navigation MUST use `useGameNavigation` (utilizing `router.replace`) to maintain a flat history stack.
- **Route Guarding**: Respect `NavigationGuard` logic.
- **Performance**: Adhere to "Native-First" rendering (CSS Grid, composite-only updates).
- **Responsive Design**: Mobile-First approach; optimized for mobile landscape and tablet landscape orientations.

## Acceptance Criteria
- [ ] Navigation flow is complete and follows "History Neutrality".
- [ ] Instrument selection is input-driven and avoids auto-selection on mount.
- [ ] Theme selection updates the visual style globally.
- [ ] Results page accurately reflects context-stored session data.
- [ ] Track Selection features previews and extended metadata.
- [ ] UI is fully functional and visually polished in landscape modes.
