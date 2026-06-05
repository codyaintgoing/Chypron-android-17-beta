import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { buildTools, BuildTarget, BuildEnvironment } from './src/buildtools';

export default defineConfig(({ command, mode }) => {
  // Initialize build tools with current environment
  buildTools.setEnvironment(mode as BuildEnvironment);
  buildTools.setTarget(process.env.BUILD_TARGET as BuildTarget || BuildTarget.HYBRID);

  // Get base configuration from BuildTools
  const buildConfig = buildTools.getBuildConfig();
  const envVars = buildTools.getEnvVars();

  return {
    plugins: [
      react(),
      tailwindcss(),
      ...buildTools.getPluginConfig(),
    ],

    // Define global variables
    define: {
      ...buildConfig.define,
      'process.env': JSON.stringify(envVars),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'virtual:build-info': 'virtual:build-info',
      },
    },

    server: {
      // HMR configuration for development
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
    },

    build: buildConfig.build || {
      outDir: 'dist',
      sourcemap: !buildTools.getEnvironment().includes('production'),
      target: 'ES2022',
      reportCompressedSize: false,
    },

    preview: {
      port: 4173,
      host: '0.0.0.0',
    },

    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@google/genai',
        'firebase',
        'express',
      ],
      exclude: ['virtual:build-info'],
    },
  };
});
