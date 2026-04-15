# MIDI Jam 🎹

Midi Jam is an experimental project exploring **agentic coding** and demonstrating the power of AI-driven development. It is primarily built using the **Gemini CLI**, along with **Antigravity** and **Cursor** (as quotas allow), utilizing a suite of specialized agent skills for a disciplined, high-performance implementation.

## Core Features

- **MIDI Connectivity**: Seamless connection to digital instruments via USB-A/Web MIDI API.
- **88-Key Piano Visualizer**: High-performance, responsive visualizer with real-time feedback and 21-unit octave grid precision.
- **8bitcn UI**: Retro-styled components and blocks powered by the [8bitcn](https://8bitcn.com) registry.
- **Falldown Visuals**: Immersive piano roll visualizer for MIDI file playback.
- **Scoring System**: Real-time accuracy tracking, combo counters, and persistent high scores.
- **Playful UX**: Designed for an engaging and fun learning experience.
- **Future Roadmap**: Support for digital drumset visualization and other MIDI instruments.

## Getting Started

### Prerequisites

- **Node.js**: Implemented with Node 24 (Next.js 16+ / React 19).
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

> [!IMPORTANT]
> The development server MUST run on HTTPS (`--experimental-https`) to enable secure browser features like Web MIDI and Fullscreen.
> Open [https://localhost:3000](https://localhost:3000) to start jamming! You may need to trust the temporary local certificate in your browser.

## Development

This project follows a strict **Superpowers** workflow. Development is driven by specialized agent skills for planning, execution, and verification.

For detailed development principles, rendering patterns, and workflow instructions, please refer to [AGENTS.md](./AGENTS.md).

### Available Scripts

- `npm run dev`: Start development server (HTTPS).
- `npm run storybook`: Launch Storybook for component development and preview.
- `npm run build`: Create production build.
- `npm run lint:fix`: Lint and format code with Biome.
- `npm run type-check`: Run TypeScript type checking.
- `npm test`: Execute Vitest unit and component tests.

---

Made with ❤️ by AI Agents.
