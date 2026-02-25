# MIDI Jam 🎹

MIDI Jam is an experimental project exploring **agentic coding** and demonstrating the power of AI-driven development. It is built using the **Gemini CLI** and the [Conductor](https://github.com/gemini-cli-extensions/conductor) extension for a disciplined, step-by-step implementation.

The project integrates advanced agent skills for **React best practices** and **web design guidelines**, while leveraging [embedded Next.js 16 documentation](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) to ensure strict alignment with the latest APIs and high-performance patterns.

Beyond its technical foundations, MIDI Jam is a fun, game-like web application designed to help kids learn musical instruments. It connects to digital instruments via the Web MIDI API, providing an immersive experience reminiscent of _Guitar Hero_.

## ✨ Features

- **3D Perspective "Track"**: A dynamic visualizer that brings music to life.
- **Contextual Keyboard Zooming**: Automatically adjusts to the range of the song being played.
- **Real-time MIDI Connectivity**: Connect your digital piano or MIDI controller via USB.
- **Responsive Design**: Works across mobile, tablet, and desktop devices.
- **Agentic Implementation**: Developed using spec-driven development workflows.

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

# 🤖 AI Agent & Skill Architecture

This repository uses a structured AI orchestration system to manage how LLMs interact with our codebase. We follow the **"Persona vs. Playbook"** philosophy, separating **"Who"** the AI is from **"How"** it should perform tasks.

---

## 📂 Folder Structure

We maintain a clean separation between source instruction files and IDE-specific configurations.

| Path | Category | Purpose |
| :--- | :--- | :--- |
| `.claude/agents/` | **Who (Personas)** | Original `.md` files defining roles (e.g., `backender`, `frontend-dev`). Compatible with **Claude Code**. |
| `.agents/skills/` | **How (Rules)** | Industry standards and patterns downloaded from [skills.sh](https://skills.sh/). |
| `.antigravity/` | **Integration** | The "Brain" of the Antigravity IDE. Contains structured symlinks to the above sources. |
| ├── `skills/` | **Personas** | Mapped from `.claude/agents/`. Defines specialized agents in the IDE. |
| └── `rules/` | **Playbooks** | Mapped from `.agents/skills/`. Defines constraints and best practices. |



---

## ⚙️ Configuration (`antigravity.json`)

To prevent conflict with other AI tools (like Cursor or Windsurf), Antigravity is configured to use its own branded hidden directory for local project intelligence:

```json
{
    "agent": {
        "skillsPath": ".antigravity/skills",
        "rulesPath": ".antigravity/rules"
    }
}
```

---

## 📜 Automation Scripts

We use two primary scripts to manage the lifecycle of our AI assistants. These scripts ensure that our local environment stays in sync with community standards while maintaining a structured directory for the IDE.

### 1. `sync-agents.sh`
**Purpose:** Fetches specialized personas (the "Who") from the community.
- **Source:** [contains-studio/agents](https://github.com/contains-studio/agents)
- **Action:** Streams the repository content directly into `.claude/agents/` using `curl` and `tar`.
- **Cleanup:** Automatically excludes repository administrative files like `.gitignore`, `LICENSE`, or `package.json` to keep the source directory focused only on Markdown personas.

### 2. `setup-antigravity.sh`
**Purpose:** Maps all source files into the Antigravity ecosystem.
- **Action:** Generates a nested directory structure in `.antigravity/` using relative symbolic links.
- **Logic:** - **Standardization:** It maps `SKILL.md` or `index.md` files to `RULE.md` to satisfy Antigravity's discovery requirements.
  - **Context Preservation:** It treats `AGENTS.md` as a supplemental reference within the rule folder rather than a separate rule.
  - **Hierarchy:** It mirrors the original folder structure from `.agents/skills` to prevent naming collisions and maintain organization.
  - **Portability:** Uses calculated depth backtracking (`../../../`) so the project remains portable across different machines.

## ⌨️ NPM Commands

Add these to your `package.json` to manage your AI environment easily from the terminal:

```json
"scripts": {
  "sync-agents": "chmod +x sync-agents.sh && ./sync-agents.sh",
  "setup-antigravity": "chmod +x setup-antigravity.sh && ./setup-antigravity.sh",
  "init-ai": "npm run sync-agents && npm run setup-antigravity"
}
```

- `npm run sync-agents`: Downloads/Updates the latest personas into .claude/agents/.
- `npm run setup-antigravity`: Refreshes all symbolic links and folder structures for the IDE.
- `npm run init-ai`: Performs a full reset—syncs sources and re-builds the Antigravity mapping.

## 🌐 Intelligence Sources

We leverage high-quality community intelligence to keep our AI agents sharp and updated with the latest industry patterns.

* **Personas ("Who")**: [contains-studio/agents](https://github.com/contains-studio/agents)  
    *A library of role-based instructions designed for Product Managers, Engineers, and Designers. These define the voice and perspective of the AI.*
* **Playbooks ("How")**: [skills.sh](https://skills.sh/)  
    *Executable standards and best practices for specific frameworks (React, Tailwind, Vercel). These define the technical constraints and code quality the AI must follow.*

---

## 💡 Usage in Antigravity

Once the setup is complete, the Antigravity IDE uses a semantic router to inject the right context automatically.

1.  **Automatic Persona Selection**: The IDE scans the `description` field in the YAML frontmatter of your `.antigravity/skills` files. If you ask to *"Scaffold a new feature,"* it will automatically activate the **Rapid Prototyper** persona.
2.  **Contextual Rule Injection**: Rules stored in `.antigravity/rules` (such as `vercel-composition-patterns`) are injected based on the current file type or task. This ensures the AI follows your project's specific standards even if you switch personas mid-chat.
3.  **Manual Overrides**: You can always manually summon a specific agent by typing `@` followed by the agent name in the chat panel.