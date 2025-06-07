import { build } from 'esbuild';

build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  define: {
    'import.meta.dirname': '"."'
  }
}).catch(() => process.exit(1));