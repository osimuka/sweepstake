# 🏆 Office Sweepstake

A clean, fast sweepstake draw app built with **TypeScript** and **Vite**.

## Features

- Add participants one-by-one or paste a whole list at once
- Add sweepstake entries (teams, horses, numbers, etc.) the same way
- One-click random draw — entries are distributed fairly across all participants
- Handles unequal counts: extra entries are spread round-robin
- Print-friendly results page
- No account or server needed — runs entirely in the browser

## Getting started

```bash
# Install dependencies
npm install

# Start dev server (hot-reloading)
npm run dev

# Type-check
npm run typecheck

# Production build → dist/
npm run build

# Preview the production build locally
npm run preview
```

Then open the URL shown in your terminal (default: http://localhost:5173).

## Usage

1. Enter a name for your sweepstake (e.g. *World Cup 2026*).
2. Add every **participant** — type a name and press **Add** or Enter, or click **Paste a list…** to add multiple names at once.
3. Add every **entry** (team, horse, lottery number, etc.) the same way.
4. Click **🎲 Draw!** to randomly assign entries to participants.
5. Use **🖨 Print** to print or save the results as a PDF.
6. Click **↺ New Draw** to start over.

## Project structure

```
sweepstake/
├── index.html          # App shell (Vite entry point)
├── css/
│   └── style.css       # All styles
├── src/
│   ├── types.ts        # TypeScript interfaces
│   ├── draw.ts         # Random draw algorithm (Fisher-Yates)
│   ├── ui.ts           # DOM rendering helpers
│   └── main.ts         # Entry point — state & event wiring
├── package.json
└── tsconfig.json
```
