import { createAztecNodeClient, waitForNode } from "@aztec/aztec.js/node";
import { EmbeddedWallet } from "@aztec/wallets/embedded";
import { getInitialTestAccountsData } from "@aztec/accounts/testing";
import type { AztecNode } from "@aztec/aztec.js";
import type { Wallet } from "@aztec/wallets";
import type { SchnorrAccountManager } from "@aztec/accounts/schnorr";

export type ConnectResult = {
  node: AztecNode;
  wallet: Wallet;
  accounts: SchnorrAccountManager[];
};

export async function connect(): Promise<ConnectResult> {
  const nodeUrl = process.env.AZTEC_NODE_URL ?? "http://localhost:8080";

  const node = createAztecNodeClient(nodeUrl);
  await waitForNode(node);

  const nodeInfo = await node.getNodeInfo();
  console.log(`Connected to Aztec node at ${nodeUrl}`);
  console.log(`Node version: ${nodeInfo.nodeVersion}`);

  const wallet = await EmbeddedWallet.create(node, { ephemeral: true });
  console.log("EmbeddedWallet ready");

  let accounts: SchnorrAccountManager[] = [];

  if (nodeUrl.includes("localhost") || nodeUrl.includes("127.0.0.1")) {
    const testAccounts = await getInitialTestAccountsData();
    accounts = await Promise.all(
      testAccounts.map((account) =>
        wallet.createSchnorrAccount(account.secret, account.salt, account.signingKey),
      ),
    );
    console.log(`Registered ${accounts.length} local test accounts`);
  }

  return { node, wallet, accounts };
}

const isDirectRun = process.argv[1]?.replace(/\\/g, "/").endsWith("src/connect.ts");
if (isDirectRun) {
  connect().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
