import { defineConfig } from 'tsup';

export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'entry/comfort': 'src/entry/comfort.ts',
    },
    format: ['esm', 'cjs'],
    dts: {
        entry: {
            index: 'src/index.ts', 
            'entry/comfort': 'src/entry/comfort.ts',
        },
    },
    clean: true,
    sourcemap: true,
    target: 'es2022',
    minify: false,
    treeshake: true,
    external: ['next', 'reflect-metadata', 'path-to-regexp', 'http-status-codes'],
});