// Railway production entry point with forced WebCrypto polyfill
import { Crypto } from '@peculiar/webcrypto';

// Immediate WebCrypto setup for Railway Node.js 18
console.log('[Railway] Forcing WebCrypto polyfill...');

const webcrypto = new Crypto();

// Create polyfill object
const cryptoPolyfill = {
  getRandomValues: function(array: any) {
    console.log('[Railway] getRandomValues called');
    return webcrypto.getRandomValues(array);
  },
  subtle: webcrypto.subtle,
  randomUUID: function() {
    return webcrypto.randomUUID ? webcrypto.randomUUID() : 
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }
};

// Force override all possible crypto references
delete (globalThis as any).crypto;
(globalThis as any).crypto = cryptoPolyfill;

if (typeof global !== 'undefined') {
  delete (global as any).crypto;
  (global as any).crypto = cryptoPolyfill;
}

// Ensure environment is production
process.env.NODE_ENV = 'production';

console.log('[Railway] WebCrypto polyfill applied successfully');
console.log('[Railway] globalThis.crypto.getRandomValues:', typeof globalThis.crypto?.getRandomValues);

// Now import the main application
import('./index.js').then(() => {
  console.log('[Railway] Application started successfully');
}).catch((error) => {
  console.error('[Railway] Application startup failed:', error);
  process.exit(1);
});