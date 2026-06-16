# Counter contract artifacts

Implements [#8](https://github.com/holoyZ/aztec/issues/8).

## Before `npm run compile:counter`

`Counter.js` is a **placeholder** so TypeScript imports resolve before the Aztec CLI runs. Deploy will exit with instructions if this file has not been replaced.

## After `npm run compile:counter`

`aztec codegen` overwrites this directory with generated bindings from:

```text
contracts/counter/target/counter_contract-Counter.json
```

Expected import path (used by `scripts/deploy.ts` and the frontend):

```typescript
import { CounterContract } from "../src/artifacts/counter/Counter.js";
```

## Local workflow

```bash
npx @aztec/aztec-sandbox    # terminal 1
npm run compile:counter     # terminal 2
npm run deploy
```

`deploy.ts` calls `CounterContract.deploy(wallet, headstart, owner)` which runs the contract `initialize` function, then `increment` and `get_counter` in a smoke test.
