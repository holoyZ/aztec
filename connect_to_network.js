import { createAztecNodeClient, waitForNode } from "@aztec/aztec.js/node";
import { EmbeddedWallet } from "@aztec/wallets/embedded";
import { getInitialTestAccountsData } from "@aztec/accounts/testing";

const nodeUrl = process.env.AZTEC_NODE_URL ?? "http://localhost:8080";

const node = createAztecNodeClient(nodeUrl);

// Wait for the network to be ready
await waitForNode(node);

const nodeInfo = await node.getNodeInfo();
console.log(`Connected to Aztec node at ${nodeUrl}`);
console.log(`Node version: ${nodeInfo.nodeVersion}`);

// Create an EmbeddedWallet connected to the node
const wallet = await EmbeddedWallet.create(node, { ephemeral: true });
console.log("EmbeddedWallet ready");

// Register pre-funded local test accounts (sandbox / local node only)
if (nodeUrl.includes("localhost") || nodeUrl.includes("127.0.0.1")) {
  const testAccounts = await getInitialTestAccountsData();
  const addresses = await Promise.all(
    testAccounts.map(async (account) => {
      const manager = await wallet.createSchnorrAccount(
        account.secret,
        account.salt,
        account.signingKey,
      );
      return manager.address;
    }),
  );
  console.log(`Registered ${addresses.length} local test accounts`);
}

export { node, wallet };
