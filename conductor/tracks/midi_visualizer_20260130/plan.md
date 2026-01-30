# Implementation Plan: Implement Core MIDI Connection and Basic Visualizer

This plan outlines the steps required to implement the core Web MIDI API connection and a basic visualizer, following the principles of Test-Driven Development (TDD) and the project's defined workflow.

## Phase 1: Web MIDI API Connection

- [x] Task: Setup Web MIDI API Access (00bb60a)
    - [x] Write Failing Tests: Create tests to ensure the browser environment supports Web MIDI API and can request access. These tests should initially fail, confirming the absence of the required functionality.
    - [x] Implement to Pass Tests: Implement the necessary code to request Web MIDI API access and gracefully handle both successful access and cases where access is denied or not supported.
    - [x] Refactor: Review and refactor the MIDI access request logic for clarity, error handling, and adherence to best practices.
- [ ] Task: List Available MIDI Input Devices
    - [ ] Write Failing Tests: Develop tests to verify that the application can correctly enumerate and display a list of all connected MIDI input devices. These tests should fail until the enumeration logic is implemented.
    - [ ] Implement to Pass Tests: Implement the functionality to detect and list all available MIDI input devices, making them accessible for user selection.
    - [ ] Refactor: Optimize the device listing mechanism, ensuring efficient updates and robust error handling for device changes.
- [ ] Task: Select and Connect to a MIDI Device
    - [ ] Write Failing Tests: Create tests to simulate user selection and connection to a mock MIDI device, asserting that the application correctly establishes and manages the connection.
    - [ ] Implement to Pass Tests: Develop the user interface and underlying logic that allows users to select a MIDI input device from the enumerated list and establish a connection.
    - [ ] Refactor: Enhance the device connection stability, improve user feedback during connection/disconnection, and ensure seamless integration with the UI.
- [ ] Task: Conductor - User Manual Verification 'Web MIDI API Connection' (Protocol in workflow.md)

## Phase 2: MIDI Input Processing and Basic Visualizer

- [ ] Task: Receive MIDI Note On/Off Messages
    - [ ] Write Failing Tests: Implement tests that simulate MIDI "note on" and "note off" messages, ensuring the application's event listeners correctly capture and interpret these messages.
    - [ ] Implement to Pass Tests: Set up event listeners on the connected MIDI device to receive and parse incoming MIDI "note on" and "note off" messages, extracting relevant data such as note number and velocity.
    - [ ] Refactor: Improve the MIDI message parsing logic and ensure efficient and reliable event dispatching to other components.
- [ ] Task: Create Basic On-Screen Visualizer
    - [ ] Write Failing Tests: Develop tests to verify that the basic visualizer component reacts correctly to simulated MIDI "note on" and "note off" events, confirming visual changes occur as expected.
    - [ ] Implement to Pass Tests: Develop a basic visual component, such as a representation of piano keys, that visually responds to received MIDI "note on" (e.g., key lights up) and "note off" (e.g., key darkens) events.
    - [ ] Refactor: Optimize the visualizer's performance to ensure smooth and immediate feedback, and refine its styling to align with the game-like UI concept.
- [ ] Task: Conductor - User Manual Verification 'MIDI Input Processing and Basic Visualizer' (Protocol in workflow.md)
