// FORCE override EVERYTHING
delete (globalThis as any).crypto;
delete (global as any).crypto;

(globalThis as any).crypto = cryptoPolyfill;
(global as any).crypto = cryptoPolyfill;

// Override the internal 'w' variable that Neon uses
(globalThis as any).w = cryptoPolyfill;

// Override process.versions to fool Neon into thinking we have WebCrypto
if (typeof process !== 'undefined') {
  process.env.NODE_ENV = 'production';
  (process as any).crypto = cryptoPolyfill;
}

console.log('[Railway] AGGRESSIVE WebCrypto override complete');
console.log('[Railway] globalThis.crypto:', typeof globalThis.crypto?.getRandomValues);
console.log('[Railway] global.crypto:', typeof (global as any).crypto?.getRandomValues);

// Test immediately
try {
  const test = new Uint8Array(16);
  globalThis.crypto.getRandomValues(test);
  console.log('[Railway] WebCrypto test PASSED');
} catch (error) {
  console.error('[Railway] WebCrypto test FAILED:', error);
}

// NOW import the main application
import('./index.js').then(() => {
  console.log('[Railway] Application started successfully');
}).catch((error) => {
  console.error('[Railway] Application startup failed:', error);
  process.exit(1);
});
