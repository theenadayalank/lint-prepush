import { run } from "./cli.ts";
run().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
