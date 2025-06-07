// Critical: Setup WebCrypto before importing Neon
import { Crypto } from '@peculiar/webcrypto';

// Railway Node.js 18 WebCrypto fix - must be synchronous
if (process.env.NODE_ENV === 'production' || !globalThis.crypto?.getRandomValues) {
  const webcrypto = new Crypto();
  
  // Override the global crypto object for Railway compatibility
  const cryptoPolyfill = {
    getRandomValues: webcrypto.getRandomValues.bind(webcrypto),
    subtle: webcrypto.subtle,
    randomUUID: webcrypto.randomUUID?.bind(webcrypto) || (() => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    })
  };
  
  // Force override globalThis.crypto
  try {
    delete (globalThis as any).crypto;
  } catch {}
  
  (globalThis as any).crypto = cryptoPolyfill;
  
  // Also set on process for Node.js modules
  if (typeof process !== 'undefined' && !process.env.DISABLE_CRYPTO_PATCH) {
    (process as any).crypto = cryptoPolyfill;
  }
}

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
