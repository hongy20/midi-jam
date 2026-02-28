# MIDI Jam 🎹

MIDI Jam is an experimental project exploring **agentic coding** and demonstrating the power of AI-driven development. It is built using the **Gemini CLI** and the [Conductor](https://github.com/gemini-cli-extensions/conductor) extension for a disciplined, step-by-step implementation.

The project integrates advanced agent skills for **React best practices** and **web design guidelines**, while leveraging [embedded Next.js 16 documentation](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) to ensure strict alignment with the latest APIs and high-performance patterns.

Beyond its technical foundations, MIDI Jam is a fun, game-like web application designed to help kids learn musical instruments. It connects to digital instruments via the Web MIDI API, providing an immersive experience reminiscent of _Guitar Hero_.

## ✨ Features

- **3D Perspective "Track"**: A dynamic visualizer that brings music to life with "Guitar Hero" style mechanics.
- **Contextual Keyboard Zooming**: Automatically adjusts the piano range (21 to 108) to the specific song being played.
- **Real-time MIDI Connectivity**: Zero-latency connectivity with digital pianos and MIDI controllers via Web MIDI API.
- **Interactive Score & Combo System**: Real-time feedback on hit quality (Perfect, Great, OK, Miss) with combo multipliers.
- **Responsive Design**: Optimized for mobile, tablet, and desktop with performance-first rendering.
- **Visual Themes**: Support for Neon, Dark, and Light modes to suit your play style.
- **Demo Mode**: Allows auto-playing tracks for previewing without a MIDI instrument.
- **Performance Summary**: Detailed results page with accuracy, rank (S to D), and total score.
- **Agentic Implementation**: Developed using spec-driven development workflows with Conductor.

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- A MIDI device (optional, but recommended for the full experience)
- **HTTPS is required** for the Web MIDI API. The development server includes self-signed certificates for local use.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hongy20/midi-jam.git
   cd midi-jam
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [https://localhost:3000](https://localhost:3000) in your browser.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI/Styling**: React 19, Tailwind CSS 4
- **Tooling**: Biome (Linting & Formatting), Vitest (Testing)
- **Audio**: Tone.js

## 🤖 Agentic Development

This project follows a strict **Conductor** workflow. Development is broken down into "Tracks" with clear specifications and implementation plans.

- **Linting**: `npm run lint`
- **Auto-fix**: `npm run lint:fix`
- **Type Checking**: `npm run type-check`
- **Testing**: `npm test`

https://onlinesequencer.net/sequences