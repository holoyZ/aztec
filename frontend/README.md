# Frontend

React + Vite UI for the Aztec Counter dApp. Implements [#9](https://github.com/holoyZ/aztec/issues/9).

## Structure

```text
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx              # Layout shell
    ├── CounterUI.tsx        # Connect, deploy, increment, read
    ├── connect.ts           # Re-exports src/connect.ts
    └── App.css
```

## Features

- **Connect** — uses shared `src/connect.ts` via `frontend/src/connect.ts`
- **Deploy Counter** — private Counter from `contracts/counter/`
- **Increment & Read** — private contract interactions
- Status indicator, activity log, persisted contract address (localStorage)
- Responsive layout with Tailwind CSS

## Run

```bash
npx @aztec/aztec-sandbox    # terminal 1
npm run compile:counter     # terminal 2 (first time)
npm run dev                 # http://localhost:5173
```

Aliases: `npm run frontend` (same as `dev`).
