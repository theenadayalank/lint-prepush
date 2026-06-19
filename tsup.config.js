import { defineConfig } from 'tsup';
export default defineConfig({
    entry: { 'lint-prepush': 'src/bin.ts' },
    format: ['esm'],
    platform: 'node',
    target: 'node24',
    outDir: 'dist',
    clean: true,
    sourcemap: false,
    minify: true,
    banner: { js: '#!/usr/bin/env node' },
});
