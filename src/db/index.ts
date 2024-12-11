import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Logger } from 'drizzle-orm/logger';
import { Pool } from 'pg';
import fs from 'fs';
import type { Config } from 'drizzle-kit';

// Load the CA certificate
const sslCert = fs.readFileSync('CA_Cert.crt').toString();

// Configure the PostgreSQL pool with SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    ca: sslCert,
    rejectUnauthorized: true,
  },
}) satisfies Config;

// Define the custom logger that both logs to console and file
class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    // Log to console
    console.log("Executing Query:", { query, params });
    
    // Log to file
    const log = `Query: ${query}, Params: ${JSON.stringify(params)}\n`;
    fs.appendFileSync("drizzle-queries.log", log);
  }
}

// Initialize Drizzle with the logger
const db = drizzle(pool, { logger: new MyLogger() });

export default db;