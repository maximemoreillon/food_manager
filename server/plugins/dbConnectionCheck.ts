import mongoose from "mongoose";

const CONNECTION_TIMEOUT_MS = 10000;

export default defineNitroPlugin(() => {
  const timeout = setTimeout(() => {
    console.error("[mongoose] Could not connect to MongoDB, exiting");
    process.exit(1);
  }, CONNECTION_TIMEOUT_MS);

  mongoose.connection.once("connected", () => {
    clearTimeout(timeout);
  });
});
