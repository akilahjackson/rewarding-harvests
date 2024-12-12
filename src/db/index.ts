import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Logger } from 'drizzle-orm/logger';
import { Pool } from 'pg';
import fs from 'fs';
import * as env from 'env-var';

// Validate environment variables
const DB_HOST = env.get('DB_HOST').required().asString();
const DB_PORT = env.get('DB_PORT').default('25061').asPortNumber();
const DB_DATABASE = env.get('DB_DATABASE').required().asString();
const DB_USERNAME = env.get('DB_USERNAME').required().asString();
const DB_PASSWORD = env.get('DB_PASSWORD').required().asString();

// Load the CA certificate
const sslCertPath = 'CA_Cert.crt';
const sslCert = fs.existsSync(sslCertPath) ? fs.readFileSync(sslCertPath).toString() : undefined;

if (!sslCert) {
  console.warn('SSL Certificate not found. SSL is disabled.');
}

// Configure PostgreSQL pool
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  ssl: sslCert
    ? {
        ca: sslCert,
        rejectUnauthorized: true,
      }
    : undefined,
});

// Define a custom logger
class MyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    const sanitizedParams = params.map((param) =>
      typeof param === 'string' && param.includes('password') ? '****' : param
    );
    console.log('Executing Query:', { query, params: sanitizedParams });
    fs.appendFileSync(
      'drizzle-queries.log',
      `Query: ${query}, Params: ${JSON.stringify(sanitizedParams)}\n`,
      { flag: 'a' }
    );
  }
}

// Initialize Drizzle
export const db = drizzle(pool, { logger: new MyLogger() });

// Re-export schema
export * from './schema.js';
