import { connect } from "../src/connect.js";
import { TokenContract } from "@aztec/noir-contracts.js/Token";

async function main() {
  console.log("Starting Noir Contract Deployment Example...\n");

  const { wallet, accounts } = await connect();
  const [alice] = accounts;

  if (!alice) {
    throw new Error("No test accounts available. Use a local sandbox node.");
  }

  console.log(`\nDeploying TokenContract using ${alice.address.toString().slice(0, 12)}...`);

  const deployTx = TokenContract.deploy(
    wallet,
    alice.address,
    "Aztec Starter Token",
    "AZT",
    18,
  );

  const { contract: token } = await deployTx.send({ from: alice.address }).deployed();

  console.log("TokenContract deployed successfully!");
  console.log(`Address: ${token.address.toString()}`);

  console.log("\nTesting contract...");

  await token.methods.mint_private(1000, alice.address).send({ from: alice.address }).wait();
  console.log("Minted 1000 private tokens to Alice");

  const balance = await token.methods.balance_of_private(alice.address).simulate();
  console.log(`Alice's private balance: ${balance}`);

  console.log("\nDeployment and basic test complete!");
  console.log("You can now build on top of this contract.");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
