import { connect } from "./src/connect.js";

const { node, wallet, accounts } = await connect();
console.log(`Ready with ${accounts.length} account(s)`);

export { node, wallet, accounts };
