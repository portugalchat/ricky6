// WebCrypto polyfill specifically for Railway Node.js 18 deployment
import { Crypto } from '@peculiar/webcrypto';

console.log('[WebCrypto] Initializing Railway compatibility layer');

// Create the polyfill instance
const polyfillCrypto = new Crypto();

// Force polyfill by checking if getRandomValues exists and works
let needsPolyfill = false;

try {
  if (!globalThis.crypto?.getRandomValues) {
    needsPolyfill = true;
  } else {
    // Test if getRandomValues actually works
    const testArray = new Uint8Array(1);
    globalThis.crypto.getRandomValues(testArray);
  }
} catch (error) {
  needsPolyfill = true;
}

if (needsPolyfill) {
  console.log('[WebCrypto] Applying polyfill for Railway environment');
  
  // Create a proxy that intercepts crypto access
  const cryptoProxy = new Proxy(polyfillCrypto, {
    get(target, prop) {
      if (prop === 'getRandomValues') {
        return (array: any) => {
          console.log('[WebCrypto] getRandomValues intercepted');
          return polyfillCrypto.getRandomValues(array);
        };
      }
      return target[prop as keyof Crypto];
    }
  });
  
  // Multiple strategies to ensure the polyfill is available
  try {
    // Strategy 1: Define property with getter
    Object.defineProperty(globalThis, 'crypto', {
      get: () => cryptoProxy,
      configurable: true,
      enumerable: true
    });
    
    console.log('[WebCrypto] Polyfill activated with proxy');
  } catch (e1) {
    try {
      // Strategy 2: Direct assignment for older Node.js
      (globalThis as any).crypto = cryptoProxy;
      console.log('[WebCrypto] Polyfill activated with direct assignment');
    } catch (e2) {
      console.error('[WebCrypto] All polyfill strategies failed:', e1, e2);
    }
  }
} else {
  console.log('[WebCrypto] Native crypto is working correctly');
}