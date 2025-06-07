import { Crypto } from '@peculiar/webcrypto';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Setup WebCrypto polyfill for Neon database compatibility
const webcrypto = new Crypto();

// Polyfill approach for Node.js environments (especially Railway)
if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
  // Set the polyfilled crypto object with proper methods
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      getRandomValues: webcrypto.getRandomValues.bind(webcrypto),
      subtle: webcrypto.subtle,
      randomUUID: webcrypto.randomUUID?.bind(webcrypto) || (() => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }))
    } as Crypto,
    writable: false,
    configurable: true
  });
}

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
