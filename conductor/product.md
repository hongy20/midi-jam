# Product Definition

## Initial Concept
This web application aims to assist users in learning musical instruments, specifically the piano, with potential for extension to other MIDI instruments. It connects to digital instruments via a USB-A port on mobile devices (phones or tablets) and leverages the Web MIDI API. The user interface features an immersive 3D perspective reminiscent of rhythm games like Guitar Hero.

## Core Functionalities
The application's core functionalities include:
- Seamlessly connecting to MIDI devices and processing real-time input (Note On/Off).
- Displaying an interactive, responsive 88-key piano visualizer that highlights keys in real-time and automatically zooms to the relevant note range during song playback, with a persistent C4 marker for orientation.
- Supporting MIDI file playback with an engaging "falldown" (piano roll) visual effect set in a 3D perspective "track".
- Enhancing playback with horizontal bar-lines to visualize musical measures.
- Allowing concurrent live jamming alongside MIDI file playback with visual distinction between inputs.
- Ensuring robust playback reliability with auto-re-strike on resume and accurate speed adjustments.
- Streamlining user interaction with a collapsible control header and automatic device/song selection.
- Providing a comprehensive learning platform for piano, with the architectural foresight to be extended to other MIDI instruments in the future.
