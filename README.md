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

- No custom contract deployed
- No UI
- No mainnet/testnet config out of the box (only local node unless you set `AZTEC_NODE_URL`)
- Not a production wallet (ephemeral, dev-focused)

**In short**: It gives you the foundation — connection to an Aztec node + wallet + test accounts — before you start writing contracts and transactions.

## What's next?

Here are recommended next steps to continue building your Aztec dApp:

### 1. Deploy your first Noir contract

- Follow the [Aztec Noir Contract Deployment Guide](https://docs.aztec.network/developers/tutorials/writing-noir-contracts)
- Use the `wallet` and `node` from this starter to deploy and interact with private functions.

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

# Install dependencies
npm install

# Run the connection script
npm run connect
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run connect` | Connect to node + initialize wallet + test accounts |
| `npm run dev` | *(Future)* Start development server |
| `npm test` | Run tests (when added) |

### Project Structure

Current layout:

```text
aztec/
├── connect_to_network.js   # Main connection logic
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

Planned layout as the project grows:

```text
aztec/
├── src/
│   └── connect.ts          # Main connection logic
├── scripts/
│   └── deploy.ts           # Example deployment script (coming soon)
├── contracts/              # Your Noir contracts
├── test/                   # Integration tests
├── package.json
├── tsconfig.json
└── README.md
```

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `AZTEC_NODE_URL` | `http://localhost:8080` | URL of the Aztec node |
| `AZTEC_CHAIN_ID` | — | Chain ID for the network (when targeting testnet/mainnet) |

Add more sections as your project grows (e.g., contract examples, frontend integration).

This is now saved in your project. Would you like me to proceed with creating the supporting files (`package.json`, `src/connect.ts`, `.env.example`, etc.)