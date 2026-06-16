# Counter workspace

Implements [#3](https://github.com/holoyZ/aztec/issues/3) — private Counter Noir workspace.

Aztec Noir workspace for the **private** Counter contract used by `npm run deploy` and the React frontend.

## Structure

```text
counter/
├── Nargo.toml              # Workspace root
├── counter_contract/
│   ├── Nargo.toml
│   └── src/main.nr         # Private Counter (EasyPrivateUint)
└── counter_test/
    ├── Nargo.toml
    └── src/lib.nr
```

Issue [#6](https://github.com/holoyZ/aztec/issues/6) describes a simpler flat layout (`counter/src/main.nr`) with a **public** counter. That learning example lives in [`../public-counter/`](../public-counter/).

## Compile & codegen

From project root:

```bash
npm run compile:counter
```

Artifacts: `contracts/counter/target/` → TS bindings in `src/artifacts/counter/`

## Private Counter API ([#3](https://github.com/holoyZ/aztec/issues/3))

| Function | Visibility | Description |
|----------|------------|-------------|
| `initialize(headstart, owner)` | private | Set initial hidden count for `owner` |
| `increment(owner)` | private | Add 1 to owner's counter |
| `get_counter(owner)` | utility | Read owner's counter value |

Storage: `Map<AztecAddress, EasyPrivateUint>` — per-owner encrypted counts.

### Compile manually

```bash
cd contracts/counter
aztec compile
aztec codegen ./target/counter_contract-Counter.json -o ../../src/artifacts/counter
```

Or from project root: `npm run compile:counter`

> Match the `aztec` tag in `Nargo.toml` to your CLI version (`aztec --version`). Currently pinned to **v4.3.1**.
