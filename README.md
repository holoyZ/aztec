# Aztec Connect Starter

A minimal starter template to connect to the Aztec network, set up a wallet, and prepare for building private dApps.

## What it connects to

**Aztec** is a privacy-focused L2 where you can build and use **private smart contracts** (Noir contracts, private accounts, encrypted state).

Your script connects to an **Aztec node** (by default the local sandbox at `http://localhost:8080`).

## What running `npm run connect` gives you

After running the command, you get:

1. **`node`** — A client to the Aztec network (read chain state, submit txs, etc.)
2. **`wallet`** — An `EmbeddedWallet` to sign and send Aztec transactions
3. **Test accounts (local only)** — Pre-funded sandbox accounts ready for development

This is the essential first step: proving you can reach the network and have a working wallet.

## What you can build on top of it

From here, typical Aztec dApp development flows include:

| Direction              | Examples |
|------------------------|----------|
| **Private contracts**  | Deploy Noir contracts, call private functions |
| **Private payments / apps** | Transfers, DeFi, games with hidden balances |
| **Account management** | Create and use Schnorr accounts beyond the built-in test ones |
| **Integration**        | Import `{ node, wallet }` in other scripts or a backend service |

## What it does **not** do yet

- Contract bindings are placeholders until you run `npm run compile:counter`
- No mainnet/testnet config out of the box (only local node unless you set `AZTEC_NODE_URL`)
- Not a production wallet (ephemeral, dev-focused)
- Frontend does not re-attach to a saved contract after refresh (address is persisted in localStorage only)

**In short**: It gives you the foundation — connection to an Aztec node + wallet + test accounts — before you start writing contracts and transactions.

## What's next?

Here are recommended next steps to continue building your Aztec dApp:

### 1. Deploy your first Noir contract

See [Deploying Your First Noir Contract](#deploying-your-first-noir-contract) below for the full step-by-step guide.

### 2. Run on Testnet

- Set the environment variable:

  ```bash
  export AZTEC_NODE_URL=https://testnet.aztec.network
  ```

- Re-run `npm run connect` and use real testnet accounts instead of local sandbox ones.

### 3. Create a custom Schnorr account

Generate and register a new account with your wallet.

### 4. Build a full dApp

- Add a frontend (Next.js/React + Aztec.js)
- Implement private token transfers or a shielded DeFi position
- Explore the [Aztec Developer Documentation](https://docs.aztec.network)

## Deploying Your First Noir Contract

Closes [#2](https://github.com/holoyZ/aztec/issues/2).

### High-level flow

1. Write the contract in `contracts/` (Noir + Aztec.nr macros)
2. Compile the contract (`aztec compile`)
3. Generate TypeScript bindings (`aztec codegen`)
4. Deploy using the wallet from `src/connect.ts` (Aztec.js)
5. Interact with the deployed contract instance

### Prerequisites

- Aztec local network / sandbox running (`npx @aztec/aztec-sandbox` or `aztec start --local-network`)
- `src/connect.ts` providing `node`, `wallet`, and test `accounts`
- `contracts/counter/` Noir workspace (included in this repo)

### Step-by-step

#### 1. Review the Counter contract

This starter ships a **private** Counter in `contracts/counter/counter_contract/src/main.nr` (per-owner hidden counts via `EasyPrivateUint`). It uses `initialize`, `increment`, and `get_counter` instead of the simpler public-counter example from the [Aztec tutorials](https://docs.aztec.network/developers/tutorials/writing-noir-contracts).

#### 2. Compile and generate TypeScript bindings

```bash
# From project root (sandbox must be running)
npm run compile:counter
```

This runs:

```bash
cd contracts/counter && aztec compile
aztec codegen contracts/counter/target/counter_contract-Counter.json -o src/artifacts/counter
```

Bindings are written to `src/artifacts/counter/` (replacing the placeholder `Counter.js`).

#### 3. Deploy with `scripts/deploy.ts`

```typescript
import { connect } from "../src/connect.js";
import { CounterContract } from "../src/artifacts/counter/Counter.js";

async function main() {
  const { wallet, accounts } = await connect();
  const [alice] = accounts;

  const { contract: counter } = await CounterContract.deploy(wallet, 100n, alice.address)
    .send({ from: alice.address })
    .deployed();

  console.log(`Counter deployed at: ${counter.address.toString()}`);

  await counter.methods.increment(alice.address).send({ from: alice.address }).wait();
  const value = await counter.methods.get_counter(alice.address).simulate();
  console.log(`Counter value: ${value}`);
}

main().catch(console.error);
```

#### 4. Run it

```bash
npm run deploy
```

Implements [#7](https://github.com/holoyZ/aztec/issues/7) — `scripts/deploy.ts` deploys the **private** Counter from `contracts/counter/counter_contract/` using generated bindings in `src/artifacts/counter/Counter.js`.

**Required order:**

```bash
# Terminal 1
npx @aztec/aztec-sandbox

# Terminal 2
npm run compile:counter   # generates Counter.js bindings
npm run deploy            # deploy + increment + read
```

If you run `deploy` before `compile:counter`, the script exits with instructions (no commented-out code to uncomment).

Or directly:

```bash
npx tsx scripts/deploy.ts
```

### Common options

| Option | Usage |
|--------|--------|
| Custom salt | `{ salt: Fr.random() }` on `.send()` for predictable addresses |
| Sponsored fees (testnet) | `SponsoredFeePaymentMethod` |
| Skip initialization | `.send({ skipInitialization: true })` |

### Official references

- [Deploying Contracts Guide](https://docs.aztec.network/developers/docs/aztec-js/how_to_deploy_contract)
- [Token Contract Tutorial](https://docs.aztec.network/developers/docs/tutorials/contract_tutorials/token_contract)
- [Compiling Contracts](https://docs.aztec.network/developers/docs/aztec-nr/compiling_contracts)

## Deploying the Token Contract (no compile step)

Implements [#5](https://github.com/holoyZ/aztec/issues/5) — deploy the official `TokenContract` from `@aztec/noir-contracts.js` without writing or compiling your own Noir code.

### Prerequisites

- Aztec sandbox running (`npx @aztec/aztec-sandbox`)
- Dependencies installed (`npm install`)

### Run

```bash
npm run deploy:token
```

This runs `scripts/deploy-token.ts`, which:

1. Connects via `src/connect.ts`
2. Deploys `TokenContract` with Alice as admin (name: **Aztec Starter Token**, symbol: **AZT**)
3. Mints 1000 private tokens to Alice and reads her balance

No `compile:counter` step is required — bindings ship with `@aztec/noir-contracts.js`.

### Counter vs Token deploy scripts

| Script | Command | Contract |
|--------|---------|----------|
| Custom Counter | `npm run deploy` or `npm run deploy:counter` | Your Noir contract in `contracts/counter/` |
| Official Token | `npm run deploy:token` | Pre-built `TokenContract` from Aztec |

## Contracts

Implements [#6](https://github.com/holoyZ/aztec/issues/6).

The `contracts/` folder contains Noir sources for this starter:

```text
contracts/
├── counter/                  # Private Counter workspace (deploy + frontend)
│   └── counter_contract/src/main.nr
└── public-counter/           # Simple public Counter (learning example)
    └── src/main.nr
```

### Private Counter workspace ([#3](https://github.com/holoyZ/aztec/issues/3))

Production-ready Noir workspace at `contracts/counter/`:

```text
contracts/counter/
├── Nargo.toml                  # Workspace root
├── counter_contract/
│   └── src/main.nr             # Private Counter (EasyPrivateUint)
└── counter_test/
    └── src/lib.nr              # Test scaffold
```

```bash
cat contracts/counter/counter_contract/src/main.nr
npm run compile:counter
npm run deploy
```

### Public Counter (learning)

Simple public storage from issue #6 — `PublicMutable`, constructor, `increment`, `get_value`:

```bash
cat contracts/public-counter/src/main.nr
npm run compile:public-counter
```

See [`contracts/README.md`](contracts/README.md) for full details.

## Deploy Custom Counter ([#7](https://github.com/holoyZ/aztec/issues/7))

`scripts/deploy.ts` is wired to the private Counter in `contracts/counter/`:

```typescript
import { connect } from "../src/connect.js";
import { CounterContract } from "../src/artifacts/counter/Counter.js";

const { wallet, accounts } = await connect();
const [alice] = accounts;

const { contract: counter } = await CounterContract.deploy(wallet, 100n, alice.address)
  .send({ from: alice.address })
  .deployed();

await counter.methods.increment(alice.address).send({ from: alice.address }).wait();
const value = await counter.methods.get_counter(alice.address).simulate();
```

| Step | Command |
|------|---------|
| 1. Sandbox | `npx @aztec/aztec-sandbox` |
| 2. Compile + codegen | `npm run compile:counter` |
| 3. Deploy + test | `npm run deploy` |

## Artifact placeholders ([#8](https://github.com/holoyZ/aztec/issues/8))

Until you compile, `src/artifacts/counter/Counter.js` is a **placeholder** (imports resolve; deploy detects it and prints next steps).

After compilation succeeds, codegen replaces it with real `CounterContract` bindings from `contracts/counter/target/counter_contract-Counter.json`.

```bash
# 1. Start sandbox (terminal 1)
npx @aztec/aztec-sandbox

# 2. Compile + codegen (terminal 2)
npm run compile:counter

# 3. Deploy — uses initialize(headstart, owner) via CounterContract.deploy(wallet, 100n, alice.address)
npm run deploy
```

The Noir contract imports `EasyPrivateUint` correctly in `contracts/counter/counter_contract/src/main.nr`. See [`src/artifacts/counter/README.md`](src/artifacts/counter/README.md).

## Compilation ([#4](https://github.com/holoyZ/aztec/issues/4))

npm scripts for compiling the private Counter and generating TypeScript bindings:

| Script | Description |
|--------|-------------|
| `npm run compile` | Compile `contracts/counter/counter_contract` |
| `npm run codegen` | Generate TS bindings → `src/artifacts/counter/` |
| `npm run compile:counter` | **Both** (recommended one-command workflow) |

### Quick start

```bash
# 1. Ensure Aztec sandbox is running
npx @aztec/aztec-sandbox

# 2. Compile the custom Counter contract
npm run compile:counter
```

This will:

1. Compile `contracts/counter/counter_contract` via `aztec compile`
2. Run `aztec codegen` → output artifacts to `src/artifacts/counter/`

Then deploy or start the UI:

```bash
npm run deploy
npm run dev
```

## Frontend / UI ([#9](https://github.com/holoyZ/aztec/issues/9))

React + Vite dashboard at **http://localhost:5173**:

```text
frontend/
├── src/App.tsx         # Layout
├── src/CounterUI.tsx   # Connect · Deploy · Increment · Read
├── src/connect.ts      # Re-export of src/connect.ts
└── src/main.tsx
```

| Feature | Description |
|---------|-------------|
| Connect | Aztec node + EmbeddedWallet + test accounts |
| Deploy Counter | Private Counter from `contracts/counter/` |
| Increment / Read | Private interactions + live counter display |
| UI | Tailwind CSS, status badge, activity log, localStorage address |

```bash
npx @aztec/aztec-sandbox
npm install
npm run compile:counter
npm run dev          # or: npm run frontend
```

See [`frontend/README.md`](frontend/README.md).

## App component ([#10](https://github.com/holoyZ/aztec/issues/10))

The Counter dApp UI implements the full flow from issue #10:

- `connect()` → wallet + test accounts
- `CounterContract.deploy(wallet, 42n, alice.address)`
- `increment` / `get_counter` with status, logs, and counter display

| File | Role |
|------|------|
| `frontend/src/App.tsx` | Page layout (header, footer) |
| `frontend/src/CounterUI.tsx` | State, handlers, control panel, activity log |

```bash
npm run dev   # → http://localhost:5173
```

## Useful Resources

- [Aztec Docs](https://docs.aztec.network)
- [Noir Language Book](https://noir-lang.org/docs)
- [Aztec GitHub](https://github.com/AztecProtocol)

## Project Setup

### Prerequisites

- Node.js 20+ (Linux, macOS, or WSL — not native Windows)
- Aztec sandbox running locally (`npx @aztec/aztec-sandbox` or Docker)

### Installation

```bash
# Clone the repo
git clone https://github.com/holoyZ/aztec.git
cd aztec

# Bootstrap (install deps + verify structure)
bash setup.sh

# Or manually:
npm install
```

### Bootstrap (`setup.sh`)

Issue [#12](https://github.com/holoyZ/aztec/issues/12) — run after clone to install dependencies and verify the project layout:

```bash
chmod +x setup.sh   # if needed
bash setup.sh
```

**Agent prompt:** You are continuing an Aztec dApp starter. Run `bash setup.sh` after clone. Maintain consistency with `contracts/counter`, `src/connect.ts`, `scripts/deploy.ts`, and `frontend/`.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run connect` | Connect to node + initialize wallet + test accounts |
| `npm run compile` | Compile the Noir Counter contract |
| `npm run codegen` | Generate TypeScript bindings for Counter |
| `npm run compile:counter` | Compile + codegen private Counter (recommended) |
| `npm run compile:public-counter` | Compile public learning Counter ([#6](https://github.com/holoyZ/aztec/issues/6)) |
| `npm run deploy` | Deploy custom Counter contract (requires `compile:counter`) |
| `npm run deploy:counter` | Same as `deploy` |
| `npm run deploy:token` | Deploy official TokenContract ([#5](https://github.com/holoyZ/aztec/issues/5)) |
| `npm run dev` | Start React + Vite frontend at http://localhost:5173 |
| `npm run frontend` | Alias for `dev` ([#9](https://github.com/holoyZ/aztec/issues/9)) |
| `npm run build` | Build frontend for production |
| `npm test` | Run tests (when added) |

### Project Structure

```text
aztec/
├── setup.sh                    # Bootstrap script (issue #12)
├── src/
│   ├── connect.ts              # Shared Aztec connection logic
│   └── artifacts/counter/      # Generated TS bindings (after compile:counter)
├── scripts/
│   ├── deploy.ts               # Custom Counter deployment ([#7](https://github.com/holoyZ/aztec/issues/7))
│   └── deploy-token.ts         # Official TokenContract deployment (#5)
├── contracts/                  # Noir contracts ([#6](https://github.com/holoyZ/aztec/issues/6))
│   ├── counter/                # Private Counter workspace
│   └── public-counter/         # Public learning example
├── frontend/                   # React + Vite UI ([#9](https://github.com/holoyZ/aztec/issues/9))
│   └── src/
│       ├── App.tsx
│       ├── CounterUI.tsx
│       └── connect.ts
├── connect_to_network.js       # Legacy connect entry (re-exports connect.ts)
├── package.json
└── README.md
```

### Full workflow

```bash
# Terminal 1 — sandbox
npx @aztec/aztec-sandbox

# Terminal 2 — compile, deploy, UI
npm run compile:counter
npm run deploy
npm run dev
```

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `AZTEC_NODE_URL` | `http://localhost:8080` | URL of the Aztec node |
| `AZTEC_CHAIN_ID` | — | Chain ID for the network (when targeting testnet/mainnet) |

Add more sections as your project grows (e.g., contract examples, frontend integration).