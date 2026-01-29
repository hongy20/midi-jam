# Project Overview

This is a web application designed to help users learn musical instruments, specifically the piano. It utilizes the Web MIDI API to connect with digital instruments and features a user interface with visual effects inspired by games like Guitar Hero.

The project is built using the following technologies:
- **Framework**: [Next.js](https://nextjs.org) (v16)
- **Language**: TypeScript
- **UI Library**: [React](https://react.dev) (v19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (v4)
- **Tooling**: [Biome](https://biomejs.dev) for linting and formatting.

# Building and Running

The following scripts are available to run, build, and maintain the application.

- **Running the development server:**
  ```bash
  npm run dev
  ```
  Open [http://localhost:3000](http://localhost:3000) to view the application.

- **Creating a production build:**
  ```bash
  npm run build
  ```

- **Running the production server:**
  ```bash
  npm run start
  ```

# Development Conventions

- **Code Quality**: All code is linted and formatted using **Biome**. It's recommended to run `npm run format` before committing changes.
- **Type Safety**: The project uses **TypeScript**. Please adhere to static typing and avoid using `any` where possible.
- **Commit Messages**: While not explicitly defined, the project history suggests a preference for **Conventional Commits**. Please follow this convention for new commits (e.g., `feat(midi): ...`, `fix(ui): ...`).
