import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Logger } from 'drizzle-orm/logger';
import { Pool } from 'pg';
import fs from 'fs';

// Load the CA certificate
const sslCert = fs.readFileSync('CA_Cert.crt').toString(); // Replace with the correct path

// Configure the PostgreSQL pool with SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    ca: sslCert, // Provide the CA certificate
    rejectUnauthorized: true, // Validate the certificate
  },
}) satisfies Config;

// Define the custom logger
class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log("Executing Query:", { query, params });
  }
}

// Initialize Drizzle with the logger
const db = drizzle(pool, { logger: new MyLogger() });

class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    const log = `Query: ${query}, Params: ${JSON.stringify(params)}\n`;
    fs.appendFileSync("drizzle-queries.log", log);
  }
}
export default db;
