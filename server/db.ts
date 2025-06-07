import { Crypto } from '@peculiar/webcrypto';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Force WebCrypto polyfill for Neon database compatibility
const crypto = new Crypto();

// Override global crypto completely to ensure all methods work
globalThis.crypto = crypto;

// Also ensure it's available on global (for compatibility)
if (typeof global !== 'undefined') {
  global.crypto = crypto;
}

// Configure Neon to use ws for WebSocket connections
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
