# Frontend

React + Vite UI for the Aztec Counter dApp. Implements [#9](https://github.com/holoyZ/aztec/issues/9) and [#10](https://github.com/holoyZ/aztec/issues/10).

## Structure

```text
frontend/
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.tsx
    ├── App.tsx              # App shell — layout, header, footer ([#10](https://github.com/holoyZ/aztec/issues/10))
    ├── CounterUI.tsx        # Full dApp logic: connect, deploy, increment, read
    ├── connect.ts           # Browser connect (VITE_AZTEC_NODE_URL)
    └── App.css
```

Issue [#10](https://github.com/holoyZ/aztec/issues/10) specified a single `App.tsx` with all state and handlers. That logic lives in **`CounterUI.tsx`**; **`App.tsx`** provides the page chrome (same UI, cleaner split from #9).

**Browser vs Node:** CLI scripts use `src/connect.node.ts` (`process.env`). The frontend uses `frontend/src/connect.ts` with `import.meta.env.VITE_AZTEC_NODE_URL` and the browser `EmbeddedWallet` entry (no top-level `process` usage).

## Features

- **Connect** — uses `frontend/src/connect.ts` (browser-safe; `VITE_AZTEC_NODE_URL`, IndexedDB wallet)
- **Deploy Counter** — private Counter from `contracts/counter/`
- **Increment & Read** — private contract interactions
- Status indicator, activity log, persisted contract address ([localStorage](https://github.com/holoyZ/aztec/issues/11))
- Responsive layout with Tailwind CSS

## Run

```bash
npx @aztec/aztec-sandbox    # terminal 1
npm run compile:counter     # terminal 2 (first time)
npm run dev                 # http://localhost:5173
```

Aliases: `npm run frontend` (same as `dev`).

## localStorage persistence ([#11](https://github.com/holoyZ/aztec/issues/11))

Contract address is saved under `counterContractAddress`:

| Event | Behavior |
|-------|----------|
| **Deploy** | `localStorage.setItem('counterContractAddress', addr)` |
| **Page load** | Restores address + logs `Loaded saved contract address: …` |
| **UI** | Label shows **Contract Address (persisted)** |

The address survives refresh until browser storage is cleared. **Note:** increment/read after refresh still require a new connect + deploy (or future re-attach via `CounterContract.at` + wallet).
