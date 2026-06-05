/**
 * BuildTools Usage Guide and Integration Module
 * Provides examples and utilities for using the BuildTools system
 */

import { buildTools, BuildEnvironment, BuildTarget, isProduction, isDevelopment, isBrowserTarget, isNodeTarget } from './buildtools';

/**
 * Initialize and configure BuildTools for application startup
 * Call this in your main application entry point
 */
export function initializeBuildTools(): void {
  console.log('🏗️  Initializing BuildTools...');

  // Log current build environment
  console.log(`Environment: ${buildTools.getEnvironment()}`);
  console.log(`Target: ${buildTools.getTarget()}`);

  // Conditional initialization based on target
  if (isBrowserTarget()) {
    console.log('✓ Browser target detected - initializing React/DOM...');
  }

  if (isNodeTarget()) {
    console.log('✓ Node target detected - initializing server...');
  }

  // Conditional initialization based on environment
  if (isDevelopment()) {
    console.log('✓ Development mode - enabling HMR and detailed logging...');
    buildTools.setMetadata('debugMode', true);
  }

  if (isProduction()) {
    console.log('✓ Production mode - optimizations enabled...');
    buildTools.setMetadata('debugMode', false);
  }

  buildTools.logBuildSummary();
}

/**
 * Example: Access build information in components or modules
 */
export function getBuildInfo() {
  return {
    environment: buildTools.getEnvironment(),
    target: buildTools.getTarget(),
    isDev: isDevelopment(),
    isProd: isProduction(),
    isBrowser: isBrowserTarget(),
    isNode: isNodeTarget(),
  };
}

/**
 * Example: Conditionally load features based on build target
 */
export async function loadTargetSpecificFeatures() {
  if (isBrowserTarget()) {
    // Load browser-specific libraries
    console.log('Loading browser features...');
  }

  if (isNodeTarget()) {
    // Load Node.js-specific libraries
    console.log('Loading Node.js features...');
  }
}

/**
 * Example: Custom error handling based on environment
 */
export function handleError(error: Error): void {
  if (isDevelopment()) {
    console.error('🔴 [DEV] Error:', error);
    console.trace(error);
  } else {
    // In production, log to external service
    console.error('🔴 [PROD] Error occurred');
    // sendToErrorTracking(error);
  }
}

// Export BuildTools singleton for use throughout the app
export { buildTools, BuildEnvironment, BuildTarget };
