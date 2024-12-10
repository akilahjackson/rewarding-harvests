import type { Config } from "drizzle-kit";
import fs from "fs";
import "dotenv/config";

// Load SSL certificate
const sslCert = fs.readFileSync("./src/db/CA_Cert.crt").toString();

export default {
  schema: "./drizzle/schema.ts", // Path to schema file
  out: "./drizzle",      // Output directory for migrations
  dialect: "postgresql", // Use PostgreSQL dialect
  dbCredentials: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "25061", 10),
    database: process.env.DB_DATABASE,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ssl: {
      ca: sslCert,
      rejectUnauthorized: true, // Enforce SSL validation
    },
  },
} satisfies Config;
