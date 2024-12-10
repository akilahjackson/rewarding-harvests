import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
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
});

// Initialize Drizzle with the configured pool
const db = drizzle(pool);

export default db;
