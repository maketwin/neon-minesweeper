# Neon Minesweeper

Classic Minesweeper with a dark neon + glassmorphism UI. Built with Vite, React, and TypeScript.

## Features

- **Difficulties**: Beginner (9×9 / 10), Intermediate (16×16 / 40), Expert (16×30 / 99)
- First click is always safe (mines placed after first reveal)
- Left click to reveal · Right click to flag · Middle click / double-click to chord
- Flood fill on empty cells
- Timer, mine counter, restart, win/lose overlay

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project structure

```
src/
  engine/       # Pure TypeScript game logic (no React)
  components/   # Board, Cell, HUD, Overlay
  App.tsx       # App shell + state
  main.tsx
  index.css     # Neon / glass CSS variables & styles
```
