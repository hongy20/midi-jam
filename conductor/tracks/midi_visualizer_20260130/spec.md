# Specification: Implement Core MIDI Connection and Basic Visualizer

## Objective
The primary objective of this track is to establish a robust connection to MIDI devices using the Web MIDI API and to implement a basic visual feedback system that aligns with the project's goal of a game-like user interface. This will lay the foundational groundwork for more advanced features.

## Key Features

### 1. MIDI Device Discovery and Connection
-   The application shall be able to detect all available MIDI input devices connected to the system.
-   Users shall be presented with a list of available MIDI devices and be able to select their preferred input device.
-   The application shall handle successful connection and disconnection of MIDI devices.

### 2. MIDI Input Processing
-   The application shall be able to receive and interpret MIDI "note on" and "note off" messages from the connected device.
-   The system should be able to differentiate between various MIDI notes and their velocity.

### 3. Basic Visualizer
-   A visual element on the screen shall react to MIDI input.
-   For instance, an on-screen piano key should light up when its corresponding physical key is pressed on the MIDI device.
-   The visual feedback should be immediate and responsive, creating a seamless user experience.

## Acceptance Criteria
-   The application successfully requests and obtains access to the Web MIDI API.
-   Users can see a list of connected MIDI input devices.
-   Users can select a MIDI input device, and the application connects to it.
-   Pressing a key on the connected MIDI device triggers a visible change in a corresponding on-screen element.
- Releasing a key on the connected MIDI device reverts the visual change in the corresponding on-screen element.
-   No errors are logged in the browser console during MIDI device connection or during note input.

## Constraints
-   **Visual Implementation**: The visualizer must be implemented using **pure CSS** (animations, transitions) and DOM elements. The use of the `<canvas>` element is **strictly prohibited** to ensure consistency with the UI framework and accessibility.

