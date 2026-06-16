# Contracts

Noir smart contracts for the Aztec Connect Starter.

Implements [#6](https://github.com/holoyZ/aztec/issues/6).

## Layout

```text
contracts/
├── README.md                 # This file
├── counter/                  # Primary Counter workspace (private, used by deploy + frontend)
│   ├── counter_contract/     # Main contract crate → src/main.nr
│   └── counter_test/         # Noir tests (scaffold)
└── public-counter/           # Learning example — simple public Counter from issue #6
    └── src/main.nr
```

## Which contract to use?

| Path | Type | Used by |
|------|------|---------|
| `counter/counter_contract/` | **Private** counter (`EasyPrivateUint`, per-owner hidden counts) | `npm run deploy`, frontend, `compile:counter` |
| `public-counter/` | **Public** counter (`PublicMutable<u32>`) | Learning / reference only ([#6](https://github.com/holoyZ/aztec/issues/6)) |

## View the main contract

```bash
cat contracts/counter/counter_contract/src/main.nr
```

## View the public learning example

```bash
cat contracts/public-counter/src/main.nr
```

## Compile

```bash
# Primary private Counter (required before deploy / frontend)
npm run compile:counter

# Optional — public learning contract
npm run compile:public-counter
```

## What the public Counter demonstrates

- Storage (`PublicMutable` value)
- Constructor (`initializer`)
- Public functions (`increment`, `get_value`)

The private Counter in `counter/counter_contract/` extends this with encrypted per-account balances.
