import { build } from 'esbuild';

// Build main application
await build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/index.js',
  packages: 'external',
  define: {
    'import.meta.dirname': '"."'
  }
});

// Build Railway entry point with WebCrypto polyfill
await build({
  entryPoints: ['server/railway-entry.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: 'dist/railway-entry.js',
  packages: 'external',
  define: {
    'import.meta.dirname': '"."'
  }
});
