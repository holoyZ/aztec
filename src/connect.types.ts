import type { AztecNode } from "@aztec/aztec.js";
import type { Wallet } from "@aztec/wallets";
import type { SchnorrAccountManager } from "@aztec/accounts/schnorr";

export type ConnectResult = {
  node: AztecNode;
  wallet: Wallet;
  accounts: SchnorrAccountManager[];
};
