import tsPlugin from 'rollup-plugin-ts'

const plugins = [tsPlugin()]
const external = ['child_process', 'fs', 'path', 'chokidar', 'chalk', 'simple-update-notifier']

const pgk = {
    plugins,
    external,
    input: './src/index.ts',
    output: {
        file: './build/index.js',
        format: 'cjs',
        exports: 'named',
        name: 'cpace',
    },
}

const cli = {
    plugins,
    external,
    input: './src/bin/cli.ts',
    output: {
        file: './build/cli.js',
        format: 'cjs',
        exports: 'none',
        banner: '#!/usr/bin/env node',
    },
}

export default [pgk, cli]
