import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts', 'src/**/*.{ts,tsx}'],
  splitting: true,
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  outDir: 'dist',
});
