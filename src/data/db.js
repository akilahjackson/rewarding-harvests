import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Load SSL Certificate
const sslCert = fs.readFileSync('CA_Cert.crt').toString();

// Initialize the PostgreSQL Pool with SSL configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: sslCert, // Use the CA certificate for secure connection
    rejectUnauthorized: true, // Enforce certificate validation
  },
});

// Test the connection to the database
(async () => {
  try {
    console.log("Attempting to connect to the database...");
    const client = await pool.connect();
    console.log("✅ Successfully connected to the database.");
    client.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("❌ Error connecting to the database:", err.message);
    console.error(err.stack);
  } finally {
    await pool.end(); // Close the connection pool
    console.log("✅ Database connection pool closed.");
  }
})();

export default pool;
