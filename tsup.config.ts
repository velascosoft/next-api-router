import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: 'src/index.ts'
    },
    format: ['esm', 'cjs'],
    dts: {
        entry: {
            index: 'src/index.ts'
        },
    },
    clean: true,
    sourcemap: true,
    target: 'es2022',
    treeshake: true,
    minify: false,
    external: ['next', 'reflect-metadata', 'path-to-regexp', 'http-status-codes'],
});
