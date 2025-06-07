// Neon database patch for Railway Node.js 18 compatibility
import { Crypto } from '@peculiar/webcrypto';

// Store original module loader
const originalRequire = typeof require !== 'undefined' ? require : null;

// Create WebCrypto polyfill
const webcrypto = new Crypto();

// Patch the global crypto before any Neon modules load
const patchCrypto = () => {
  // Check if we're in a Node.js environment without proper WebCrypto
  if (typeof globalThis !== 'undefined') {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    
    if (!descriptor || !globalThis.crypto?.getRandomValues) {
      console.log('[Neon Patch] Setting up WebCrypto for Railway');
      
      // Create a complete crypto implementation
      const cryptoImpl = {
        getRandomValues: (array: any) => webcrypto.getRandomValues(array),
        subtle: webcrypto.subtle,
        randomUUID: () => webcrypto.randomUUID?.() || crypto.randomUUID()
      };
      
      // Force the crypto object to be available
      if (!descriptor || descriptor.configurable) {
        try {
          Object.defineProperty(globalThis, 'crypto', {
            value: cryptoImpl,
            writable: true,
            configurable: true,
            enumerable: true
          });
          console.log('[Neon Patch] WebCrypto patched successfully');
        } catch (e) {
          console.warn('[Neon Patch] Failed to patch crypto:', e);
        }
      }
    }
  }
};

// Apply patch immediately
patchCrypto();

// Also patch process.env to ensure NODE_ENV is set for production builds
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

export { patchCrypto };