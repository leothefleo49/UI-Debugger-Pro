import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx', 'src/plugin.ts', 'src/next-plugin.ts', 'src/webpack-plugin.ts', 'src/inject.ts'],
  format: ['cjs', 'esm', 'iife'],
  globalName: 'UIDebuggerPro',
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
