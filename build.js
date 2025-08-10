import { build } from 'esbuild'

await build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outfile: 'dist/index.js',
  external: [
    '@modelcontextprotocol/sdk',
    'axios',
    'dotenv',
    'zod',
  ],
  sourcemap: false,
  minify: true,
  keepNames: true,
  banner: {
    js: '#!/usr/bin/env node'
  }
})

console.log('Build completed successfully!')