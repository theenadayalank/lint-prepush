import { defineConfig } from 'tsup';
 
export default defineConfig({
    format: ['esm'],
    entry: ['./src/lint-prepush.js'],
    platform: 'node',
    target: 'node20',
    outDir: 'dist',
    clean: true,
    sourcemap: false,
    minify: true,
});