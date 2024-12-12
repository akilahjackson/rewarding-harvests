// Import Required Modules
const axios = require("axios");
const fs = require("fs");
const { pgTable, serial, varchar, timestamp } = require("drizzle-orm/pg-core");
const { drizzle } = require("drizzle-orm/node-postgres");
const { eq } = require("drizzle-orm/expressions");
const { Pool } = require("pg");

// Database Configuration
const DB_USERNAME = "doadmin";
const DB_PASSWORD = "AVNS_-vltjGtkDGYfoog8gqR";
const DB_HOST = "rh-2024-do-user-18213260-0.l.db.ondigitalocean.com";
const DB_PORT = 25061;
const DB_DATABASE = "rh-pool1";

// GameShift API Configuration
const GAMESHIFT_API_URL = "https://api.gameshift.dev/nx/users";
const GAMESHIFT_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiIzMjkxZGYyMy0zODY1LTQwNjEtYTcxZS1kOGIzZGE1ZGYyNTgiLCJzdWIiOiIxNjI3MWQ0Mi1kMDdjLTRmNTgtOTQ2MC05Nzg4MTY3NjkxNjEiLCJpYXQiOjE3MzMzNzQxMTV9.HjZ5MPjypiPSoyGqxrw22IPYsgssRTGPWW4M_DBzWxw";

// Load CA Certificate for SSL
let sslConfig;
try {
  const caCert = fs.readFileSync("./CA_Cert.crt").toString();
  sslConfig = {
    rejectUnauthorized: false,
    ca: caCert,
  };
} catch (error) {
  console.error("❌ Failed to load CA certificate:", error.message);
  process.exit(1);
}

// Configure PostgreSQL with Drizzle ORM
const pool = new Pool({
  user: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  ssl: sslConfig,
});

// Initialize Drizzle ORM
const db = drizzle(pool);

// Define Users Table Using Drizzle ORM
const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  gameshiftId: varchar("gameshift_id", { length: 100 }).unique(),
  username: varchar("username", { length: 100 }),
  email: varchar("email", { length: 255 }).unique(),
  walletType: varchar("wallet_type", { length: 100 }),
  walletAddress: varchar("wallet_address", { length: 255 }).unique(),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

/**
 * Fetch Wallet Info from GameShift API
 */
const fetchWalletInfo = async (referenceId) => {
  try {
    const url = `${GAMESHIFT_API_URL}/${referenceId}/wallet-address`;

    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
        "x-api-key": GAMESHIFT_API_KEY,
      },
    });

    if (response.data && response.data.address && response.data.walletProvider) {
      console.log(
        `✅ Fetched wallet info for ${referenceId}: Address - ${response.data.address}, Provider - ${response.data.walletProvider}`
      );
      return { walletAddress: response.data.address, walletType: response.data.walletProvider };
    } else {
      throw new Error(`Wallet info not found for reference ID: ${referenceId}`);
    }
  } catch (error) {
    console.error(`❌ Error fetching wallet info for ${referenceId}:`, error.message);
    return { walletAddress: null, walletType: null };
  }
};

/**
 * Insert or Update User in the Database
 */
const upsertUser = async (user) => {
  try {
    const { walletAddress, walletType } = await fetchWalletInfo(user.referenceId);

    // Check if User Already Exists
    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.gameshiftId, user.referenceId));

    if (existingUser) {
      // Update Existing User
      await db
        .update(usersTable)
        .set({
          email: user.email,
          walletType: walletType,
          walletAddress: walletAddress,
        })
        .where(eq(usersTable.gameshiftId, user.referenceId));

      console.log(`✅ User updated: ${user.email} (${user.referenceId})`);
    } else {
      // Insert New User
      await db.insert(usersTable).values({
        gameshiftId: user.referenceId,
        email: user.email,
        walletType: walletType,
        walletAddress: walletAddress,
      });

      console.log(`✅ User added: ${user.email} (${user.referenceId})`);
    }
  } catch (error) {
    console.error(`❌ Failed to upsert user ${user.email}:`, error.message);
  }
};

/**
 * Fetch All Users from GameShift API
 */
const fetchAllUsers = async () => {
  try {
    const response = await axios.get(GAMESHIFT_API_URL, {
      headers: {
        accept: "application/json",
        "x-api-key": GAMESHIFT_API_KEY,
      },
    });

    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error("Unexpected API response format. Expected `data` array.");
    }

    console.log(`✅ Fetched ${response.data.data.length} users successfully.`);
    return response.data.data;
  } catch (error) {
    console.error("❌ API Response Error:", error.message);
    throw new Error("Failed to fetch users from GameShift.");
  }
};

/**
 * Main Function to Sync Users
 */
const syncUsers = async () => {
  console.log("🚀 Starting sync process...");

  try {
    const users = await fetchAllUsers();

    if (!users || !Array.isArray(users)) {
      console.error("❌ Users are not iterable. Expected an array.");
      return;
    }

    for (const user of users) {
      await upsertUser(user);
    }

    console.log("✅ User synchronization complete.");
  } catch (error) {
    console.error("❌ Error during synchronization:", error.message);
  } finally {
    await pool.end(); // Close PostgreSQL connection
  }
};

// Execute the Sync Process
syncUsers();
