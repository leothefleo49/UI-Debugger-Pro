import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm', 'iife'],
  globalName: 'UIDebuggerPro',
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  // Inject React for the IIFE build so it works standalone
  noExternal: ['react', 'react-dom'], 
});
