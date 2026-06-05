# BuildTools - Active Build Configuration

Complete BuildTools import system for managing build environments, targets, and compilation configurations.

## Quick Start

### Initialize BuildTools in your application:

```typescript
// src/main.tsx
import { initializeBuildTools, getBuildInfo } from './buildtools-integration';

initializeBuildTools();
console.log('Current build:', getBuildInfo());
```

### Use BuildTools in components:

```typescript
import { buildTools, isDevelopment, isProduction } from './buildtools';

if (isDevelopment()) {
  console.log('Debug mode enabled');
}

if (isProduction()) {
  console.log('Production optimizations active');
}
```

## Build Scripts

### Development Builds

```bash
# Hybrid mode (browser + Node.js server)
npm run dev

# Browser-only development
npm run dev:browser

# Node.js server-only development
npm run dev:node
```

### Production Builds

```bash
# Full production build (browser + server)
npm run build

# Browser-only production
npm run build:browser

# Node.js server-only production
npm run build:node

# Full hybrid build
npm run build:hybrid
```

### Utilities

```bash
# Clean build artifacts and run linter
npm run clean

# Type checking
npm run type-check

# Linting
npm run lint

# Preview production build
npm run preview
```

## BuildTools API

### BuildToolsManager

The core singleton that manages build state:

```typescript
import { buildTools, BuildEnvironment, BuildTarget } from './buildtools';

// Get current state
buildTools.getEnvironment(); // 'development' | 'production' | 'staging' | 'test'
buildTools.getTarget(); // 'browser' | 'node' | 'hybrid' | 'cloudrun'

// Set state
buildTools.setEnvironment(BuildEnvironment.PRODUCTION);
buildTools.setTarget(BuildTarget.HYBRID);

// Metadata management
buildTools.setMetadata('customKey', 'customValue');
buildTools.getMetadata('customKey');

// Get configuration
buildTools.getBuildConfig(); // Vite InlineConfig
buildTools.getPluginConfig(); // Vite Plugin[]
buildTools.getEnvVars(); // Record<string, string>
```

### Utility Functions

```typescript
import { 
  isDevelopment,
  isProduction,
  isBrowserTarget,
  isNodeTarget,
  getBuildInfo,
  initializeBuildTools
} from './buildtools-integration';

// Boolean checks
isDevelopment(); // true in development mode
isProduction(); // true in production mode
isBrowserTarget(); // true for browser/hybrid targets
isNodeTarget(); // true for node/hybrid/cloudrun targets

// Get build information
getBuildInfo(); // { environment, target, isDev, isProd, isBrowser, isNode }

// Initialize (call once at app startup)
initializeBuildTools();
```

## Environment Variables

You can control the build using environment variables:

```bash
# Set build environment
NODE_ENV=production npm run build

# Set build target
BUILD_TARGET=browser npm run build:browser
BUILD_TARGET=node npm run build:node
BUILD_TARGET=hybrid npm run dev

# Disable HMR in development
DISABLE_HMR=true npm run dev
```

## Build Targets

- **`browser`** - Client-side React application only
- **`node`** - Node.js/Express server only
- **`hybrid`** - Full-stack (browser + Node.js server)
- **`cloudrun`** - Google Cloud Run optimized build

## Build Environments

- **`development`** - Development mode with source maps and HMR
- **`production`** - Production with minification and optimizations
- **`staging`** - Staging environment configuration
- **`test`** - Test environment configuration

## Virtual Module

Access build information via virtual module:

```typescript
import { BUILD_ENV, BUILD_TARGET, BUILD_TIME, BUILD_ID } from 'virtual:build-info';

console.log(`Build: ${BUILD_ID} at ${BUILD_TIME}`);
console.log(`Environment: ${BUILD_ENV}, Target: ${BUILD_TARGET}`);
```

## File Structure

```
src/
├── buildtools.ts                 # Core BuildTools manager
├── buildtools-integration.ts     # Integration utilities
├── App.tsx
├── main.tsx
└── ...
```

## Examples

### Conditional Feature Loading

```typescript
import { isBrowserTarget, isNodeTarget } from './buildtools-integration';

// Load browser-specific features
if (isBrowserTarget()) {
  import('./browser-features').then(m => m.initialize());
}

// Load server-specific features
if (isNodeTarget()) {
  import('./server-features').then(m => m.initialize());
}
```

### Error Handling

```typescript
import { isDevelopment } from './buildtools-integration';

function handleError(error: Error) {
  if (isDevelopment()) {
    console.error('🔴 [DEV]', error);
    console.trace(error);
  } else {
    console.error('🔴 [PROD] Error occurred');
    // Send to error tracking service
  }
}
```

### Build Info Component

```typescript
import { getBuildInfo } from './buildtools-integration';

export function BuildInfo() {
  const info = getBuildInfo();
  return (
    <div className="text-xs text-gray-500 font-mono">
      <p>Env: {info.environment}</p>
      <p>Target: {info.target}</p>
      <p>Debug: {info.isDev ? 'ON' : 'OFF'}</p>
    </div>
  );
}
```

## Related Configuration Files

- `vite.config.ts` - Vite configuration with BuildTools integration
- `package.json` - Build scripts and dependencies
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variable template

---

**BuildTools v1.0.0** - Active build management and compilation orchestration
