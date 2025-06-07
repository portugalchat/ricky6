import { Crypto } from '@peculiar/webcrypto';

// AGGRESSIVE WebCrypto polyfill - MUST run before ANY other imports
console.log('[WebCrypto] Starting aggressive polyfill for Railway...');

// Force create new WebCrypto instance
const forceWebCrypto = new Crypto();

// Delete any existing crypto reference
try {
  delete (globalThis as any).crypto;
  delete (global as any).crypto;
} catch (e) {
  // Ignore delete errors
}

// Create complete crypto implementation
const cryptoImpl = {
  getRandomValues: function(array: any) {
    console.log('[WebCrypto] getRandomValues called');
    return forceWebCrypto.getRandomValues(array);
  },
  subtle: forceWebCrypto.subtle,
  randomUUID: function() {
    if (forceWebCrypto.randomUUID) {
      return forceWebCrypto.randomUUID();
    }
    // Fallback UUID generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};

// Force set on all possible global references
(globalThis as any).crypto = cryptoImpl;
if (typeof global !== 'undefined') {
  (global as any).crypto = cryptoImpl;
}
if (typeof window !== 'undefined') {
  (window as any).crypto = cryptoImpl;
}

// Override the 'w' variable that Neon uses internally
(globalThis as any).w = cryptoImpl;

console.log('[WebCrypto] Aggressive polyfill applied successfully');
console.log('[WebCrypto] Testing getRandomValues:', typeof globalThis.crypto?.getRandomValues);

// Test the implementation immediately
try {
  const testArray = new Uint8Array(16);
  globalThis.crypto.getRandomValues(testArray);
  console.log('[WebCrypto] getRandomValues test passed');
} catch (error) {
  console.error('[WebCrypto] getRandomValues test failed:', error);
}

// NOW import Neon modules
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Use Supabase database URL if available, otherwise fallback to DATABASE_URL
const databaseUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "SUPABASE_DATABASE_URL or DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: databaseUrl });
export const db = drizzle({ client: pool, schema });
