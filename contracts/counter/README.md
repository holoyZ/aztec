# Counter workspace

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
