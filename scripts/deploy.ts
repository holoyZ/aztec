import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { connect } from "../src/connect.js";
import { CounterContract } from "../src/artifacts/counter/Counter.js";

const COUNTER_ARTIFACT = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/artifacts/counter/Counter.js",
);

function assertCounterArtifactsGenerated() {
  const source = readFileSync(COUNTER_ARTIFACT, "utf8");
  if (source.includes("Placeholder")) {
    console.error("Counter TypeScript bindings are not generated yet.\n");
    console.error("Run these steps first:");
    console.error("  1. npx @aztec/aztec-sandbox          # separate terminal");
    console.error("  2. npm run compile:counter");
    console.error("  3. npm run deploy");
    process.exit(1);
  }
}

async function main() {
  assertCounterArtifactsGenerated();

  console.log("Starting Custom Counter Contract Deployment...\n");

  const { wallet, accounts } = await connect();
  const [alice] = accounts;

  if (!alice) {
    throw new Error("No test accounts available. Use a local sandbox node.");
  }

  console.log(`Deploying Counter contract using ${alice.address.toString().slice(0, 12)}...`);

  const deployTx = CounterContract.deploy(wallet, 100n, alice.address);

  const { contract: counter } = await deployTx.send({ from: alice.address }).deployed();

  console.log("Counter deployed successfully!");
  console.log(`Address: ${counter.address.toString()}`);

  console.log("\nTesting contract...");
  await counter.methods.increment(alice.address).send({ from: alice.address }).wait();
  console.log("Incremented counter for Alice");

  const balance = await counter.methods.get_counter(alice.address).simulate();
  console.log(`Alice's counter value: ${balance}`);

  console.log("\nDeployment and basic test complete!");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
