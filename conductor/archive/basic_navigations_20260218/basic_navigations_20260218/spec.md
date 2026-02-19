# Functional Specification - Basic Navigations

## Overview
Implement a native game-like navigation system for the Midi Jam application. The app will transition from a single-page layout to a multi-page structure with distinct views for onboarding, setup, and gameplay.

## User Experience Goals
- Seamless transitions between different stages of the application.
- Clear and intuitive navigation flow with contextual progress indicators.
- "Native App" feeling with distinct full-screen views via history hijacking and `popstate` trapping.

## Routes & Views
1. **Welcome View (`/`)**: 
   - Landing page. 
   - Primary action: "Start Game" (navigates to `/instruments`).
   - Secondary action: "Settings".
2. **Instruments View (`/instruments`)**: 
   - MIDI instrument setup.
   - **Progress**: Step 1/2.
   - **Action**: "Continue" (navigates to `/tracks`).
   - **Rule**: "Continue" button is disabled until an instrument is selected.
   - **Placeholders**: Piano, Keyboard, Unknown MIDI Device.
3. **Tracks View (`/tracks`)**: 
   - MIDI file/track picker.
   - **Progress**: Step 2/2.
   - **Action**: "Play" (navigates to `/game`).
   - **Action**: "← Instrument Setup" (back to `/instruments`).
   - **Rule**: "Play" button is disabled until a track is selected.
   - **Placeholders**: Moonlight Sonata, Claire de Lune, Turkish March.
4. **Game View (`/game`)**: 
   - Core visualizer and player (placeholder 15s countdown).
   - **Display**: Shows previously selected instrument and soundtrack.
   - **Action**: "Pause" button (or `Esc` key) triggers an overlay.
   - **Pause Overlay**:
     - "Restart": Re-initializes the game state.
     - "Settings": Navigates to `/settings`.
     - "Quit": Navigates directly to `/results`.
     - "Resume": Closes overlay and continues countdown.
     - **Constraint**: Keyboard focus is trapped within the overlay while active.
   - **Auto-Logic**: When countdown hits 0, auto-navigate to `/results` with a short visual transition (e.g., "Victory" sting).
5. **Results View (`/results`)**: 
   - Display score and performance stats.
   - **Action**: "Play Again" (navigates to `/game` with same instrument/track).
   - **Action**: "Next Song" (navigates to `/tracks`).
   - **Action**: "Main Menu" (navigates to `/`).
6. **Settings View (`/settings`)**: 
   - Configure app preferences.
   - **Content**: Placeholders for Speed, Theme, Demo Mode, etc.
   - **Action**: "Back" button returns the user to the view they arrived from.

## History & Navigation Rules
- **History Hijacking & Trapping**: 
  - All navigations use `router.replace()`.
  - A global `popstate` listener traps the browser "Back" button to trigger in-app "Back" logic or "Pause" (if in-game).
- **Reload Safeguard**: 
  - A `beforeunload` listener will prompt for confirmation on reload during active play.
  - Manual entry to sub-routes (e.g., `/game`) without valid session state redirects to `/`.
- **Transitions**: Use simple CSS/Motion transitions (e.g., fade) between `router.replace` calls to reinforce the game-like feel.
