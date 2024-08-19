import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/lint-prepush.js"],
  outfile: "dist/lint-prepush.js",
  bundle: true,
  platform: 'node',
});
