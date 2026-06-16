import { connect } from "./connect.node.js";

connect().catch((error) => {
  console.error(error);
  process.exit(1);
});
