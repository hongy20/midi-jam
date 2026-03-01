# MIDI Jam 🎹

Midi Jam is an experimental project exploring **agentic coding** and demonstrating the power of AI-driven development. It is primarily built using the **Gemini CLI**, along with **Antigravity** and **Cursor** (as quotas allow), utilizing a suite of specialized agent skills for a disciplined, high-performance implementation.

## Core Features

- **MIDI Connectivity**: Seamless connection to digital instruments via USB-A/Web MIDI API.
- **88-Key Piano Visualizer**: High-performance, responsive visualizer with real-time feedback.
- **Falldown Visuals**: Immersive piano roll visualizer for MIDI file playback.
- **Scoring System**: Real-time accuracy tracking, combo counters, and persistent high scores.
- **Playful UX**: Designed for an engaging and fun learning experience.
- **Future Roadmap**: Support for digital drumset visualization and other MIDI instruments.

## Getting Started

### Prerequisites

- **Node.js**: Implemented with Node 24 (other versions like 22.x+ may also work).
- **MIDI Hardware**: A MIDI-compatible keyboard, drumset, or controller (connected via USB).
- **Browser**: A modern browser with Web MIDI support (Chrome, Edge, etc.).

### MIDI Resources

You can find and download MIDI files to play along with at sites like [Online Sequencer](https://onlinesequencer.net/sequences).

### Installation

```bash
npm install
```

### Running the App

```bash
npm run dev
```

Open [https://localhost:3000](https://localhost:3000) to start jamming!

## Development

This project follows a strict **Superpowers** workflow. Development is driven by specialized agent skills for planning, execution, and verification.

For detailed development principles, rendering patterns, and workflow instructions, please refer to [AGENTS.md](./AGENTS.md).

### Available Scripts

- `npm run dev`: Start development server.
- `npm run build`: Create production build.
- `npm run lint:fix`: Lint and format code with Biome.
- `npm run type-check`: Run TypeScript type checking.
- `npm test`: Execute Vitest unit and component tests.

---

Made with ❤️ by AI Agents.
