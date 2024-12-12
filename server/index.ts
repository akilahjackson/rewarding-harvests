// Required Imports
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { drizzle } from "drizzle-orm/postgres-js";
import { Pool } from "pg";
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configure Database with Drizzle ORM
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

// GameShift API Configuration
const GAMESHIFT_API_URL = "https://api.gameshift.dev/nx/users";
const GAMESHIFT_API_KEY = process.env.GAMESHIFT_API_KEY || "";

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

// Configure Middleware
app.use(cors());
app.use(bodyParser.json());

/** ---------------------------
 * Database Tables (Drizzle ORM)
 * -------------------------- */

// Define `users` Table
export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  gameshiftId: varchar("gameshift_id", { length: 100 }),
  username: varchar("username", { length: 100 }),
  email: varchar("email", { length: 255 }),
  walletType: varchar("wallet_type", { length: 100 }),
  walletAddress: varchar("wallet_address", { length: 255 }),
  avatarUrl: varchar("avatar_url", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
});

// Define `player_actions` Table
export const playerActions = pgTable("player_actions", {
  id: serial("id").primaryKey().notNull(),
  playerId: varchar("player_id", { length: 100 }),
  playerEmail: varchar("player_email", { length: 255 }),
  playerWallet: varchar("player_wallet", { length: 255 }),
  actionType: varchar("action_type", { length: 255 }).notNull(),
  actionDescription: text("action_description"),
  actionTimestamp: timestamp("action_timestamp", { mode: "string" }).defaultNow(),
  device: varchar("device", { length: 255 }).default("unknown"),
});

/** ---------------------------
 * Utility Functions
 * -------------------------- */

// JWT Token Generator
const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// Wallet Info Fetcher from GameShift
const fetchWalletInfo = async (gameshiftId: string) => {
  try {
    const url = `${GAMESHIFT_API_URL}/${gameshiftId}/wallet-address`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": GAMESHIFT_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Wallet API Error: ${response.statusText}`);
    }

    const walletData = await response.json();
    if (!walletData.address || !walletData.walletProvider) {
      throw new Error("Wallet info missing");
    }

    return {
      walletAddress: walletData.address,
      walletType: walletData.walletProvider,
    };
  } catch (error) {
    console.error(`❌ Wallet Fetch Error: ${error.message}`);
    return { walletAddress: null, walletType: null };
  }
};

/** ---------------------------
 * Middleware: Auth Checker
 * -------------------------- */
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

/** ---------------------------
 * Endpoints
 * -------------------------- */

// ** User Registration Endpoint **
app.post("/api/users/register", async (req: Request, res: Response) => {
  const { gameshiftId, email, username } = req.body;

  if (!gameshiftId || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { walletAddress, walletType } = await fetchWalletInfo(gameshiftId);

    await db
      .insert(users)
      .values({
        gameshiftId,
        username,
        email,
        walletType: walletType || "unknown",
        walletAddress: walletAddress || "unknown",
      })
      .onConflict("email")
      .doUpdate({
        set: {
          walletType: walletType || "unknown",
          walletAddress: walletAddress || "unknown",
        },
      });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message || error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ** User Login Endpoint **
app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await db.select().from(users).where(users.email.eq(email)).first();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ** Player Action Logging Endpoint **
app.post(
  "/api/player-actions",
  authMiddleware,
  async (req: Request, res: Response) => {
    const {
      playerId,
      playerEmail,
      playerWallet,
      actionType,
      actionDescription,
      device,
    } = req.body;

    if (!playerId || !playerEmail || !playerWallet || !actionType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await db.insert(playerActions).values({
        playerId,
        playerEmail,
        playerWallet,
        actionType,
        actionDescription: actionDescription || "N/A",
        device: device || "unknown",
      });

      res.status(201).json({
        status: "success",
        message: "Action logged successfully",
      });
    } catch (error) {
      console.error("❌ Error Logging Action:", error.message || error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

/** ---------------------------
 * Start Server
 * -------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Connected to Database: ${process.env.DATABASE_URL || "Localhost"}`);
  console.log(`🔐 Using GameShift API Key: ${GAMESHIFT_API_KEY ? "Set" : "Missing"}`);
});
