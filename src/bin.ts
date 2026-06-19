import { run } from "./cli.ts";

run().catch((err: unknown) => {
  console.error(err);
  process.exitCode = 1;
});
